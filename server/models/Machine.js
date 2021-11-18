
const mongoose  = require('mongoose')
const Schema = mongoose.Schema ; 

const machineSchema = new Schema({
  
  macAddress : {
   type: String,
   required:true
  },
  totalMem : Number ,
  osType : String,
  cpuModel : String,
  clockSpeed: Number,
  numCores : Number,
  numThreads : Number
},
{timestamps:true});

const Machine = mongoose.model('Machine', machineSchema) ;

module.exports = Machine ; 