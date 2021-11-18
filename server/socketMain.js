
const Machine = require('./models/Machine')


function main(io , socket){
 console.log(`socket ${socket.id} has connected`)
 let macAddress ;
 
  //auth
  socket.on('clientAuth', (key)=>{
    if(key === 'nodeClientKey'){
       socket.join('clients')
    }
    else if(key === 'uiClientKey'){
       socket.join('ui')
    }
    else{
     socket.disconnect(true)
    }
  })

  socket.on('initialData', async (data)=>{
      macAddress = data.macAddress ;
      try {
       const response = await findByMacAddressOrAdd(data);
       console.log(response)
      } 
      catch (error) {
        throw new Error(error)
      }
  })
  //data
  socket.on('perfData', (data)=>{
     console.log(data);
     console.log(macAddress)
  })
   
}


async function findByMacAddressOrAdd(data){
     try {
       const result = await Machine.findOne({macAddress: data.macAddress});
       console.log(result)
       if(!result){
           await Machine.create({
            macAddress : data.macAddress,
            totalMem : data.totalMem ,
            osType : data.osType,
            cpuModel : data.cpuModel,
            clockSpeed: data.clockSpeed,
            numCores : data.numCores,
            numThreads : data.numThreads
           })
           return true
       }else{
           return true
       }
     } catch (err) {
       throw err
     } 
}


module.exports = main ;


