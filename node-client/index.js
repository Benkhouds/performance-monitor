
const os = require('os')
const {getPerformanceData, getInfo} = require('./utils/performanceData')
const  io =require('socket.io-client')
const socket = io('http://127.0.0.1:8080');


let perfDataInterval ;

socket.on('connect',  ()=>{
  
  const networkInterfaces = os.networkInterfaces()
  let macAddress ;

  for (const key in networkInterfaces) {
    if(!networkInterfaces[key][0]['internal']){
      macAddress = networkInterfaces[key][0]['mac']   
      break;
    }
  }

  socket.emit('clientAuth', 'nodeClientKey')
  socket.emit('initialData', {...getInfo(), macAddress})


  perfDataInterval = setInterval(async ()=>{
      const data = await getPerformanceData();
      socket.emit('perfData',  {...data, macAddress});
  },1000) 


})

socket.on('disconnect', ()=>{
   clearInterval(perfDataInterval);
})
