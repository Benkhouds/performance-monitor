require('dotenv').config()
const cluster= require('cluster')
const net  = require('net')
const farmhash = require('farmhash')
const express = require('express')
const cors = require('cors')
const sio = require('socket.io')
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const socketMain = require('./socketMain')
const connectToDatabase = require('./config/db')

const threadsNumber = require('os').cpus().length ;
const PORT = process.env.PORT || 5000




async function main(){

      if(cluster.isMaster){
         console.log(`Master ${process.pid} is running`);
      
      // This stores our workers. We need to keep them to be able to reference
         // them based on source IP address. or to restart
      var workers = []
      
      let spawn = function(i){
         workers[i] = cluster.fork()
         workers[i].on('exit', (code, signal)=>{
                  console.log(code)
                  console.log('respawning worker '+ i)
                  spawn(i)
         })
      } 
      for (let index = 0; index < threadsNumber; index++) {
         spawn(index)
      }
      
         // Helper function for getting a worker index based on IP address. (i have no idea  know how it works)
         const worker_index = function(ip, len) {
         return farmhash.fingerprint32(ip) % len; 
         };
      
         // tcp server
         //we pause the socket on connection to the tcp server and we hand it to the 
         //express server which will emit the connection event and resume the socket
         const tcpServer = net.createServer({ pauseOnConnect: true }, (connection)=> {     
            //we get the ip address of the connection and we calculate the worker index
            //and then we send
            let worker = workers[worker_index(connection.remoteAddress, threadsNumber)];
            worker.send('sticky-session:connection', connection);
      
         })
      
         tcpServer.listen(PORT);
      }
      else
      { 
      
         //create a connection for each worker
         await connectToDatabase(); 
         //create http server for each worker 
         const app= express();
         const expressServer = app.listen(0)

         app.use(cors({origin: 'http://localhost:3000'}))
      
         const io  = sio(expressServer);
         const publishClient = createClient({host:'localhost' , port : 6379})
         const receiveClient= publishClient.duplicate()
         io.adapter(createAdapter(publishClient, receiveClient))
      
         io.on('connection', (socket)=>{
               socketMain(io , socket);
               console.log(`connected to worker ${cluster.worker.id}`)
         })
         io.on('error',(err)=>console.log(err))
         process.on('message', (message, connection)=>{
            if(message !== 'sticky-session:connection') return ;
      
            expressServer.emit('connection', connection);
            connection.resume()
         })
      
      }
}


main()