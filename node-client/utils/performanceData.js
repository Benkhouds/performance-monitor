
const os = require("os");

async function getPerformanceData() {

 const uptime = os.uptime();
 const freeMemory = os.freemem();
 const totalMemory = os.totalmem();
 const usedMem = totalMemory - freeMemory;
 const memoryUsage = Math.floor(100 * (usedMem / totalMemory));
 const cpuLoad = await getCpuLoad();

 return {  
   uptime,
   usedMem,
   freeMem :Math.floor(freeMemory/ (1024**3)),
   memoryUsage,
   cpuLoad,
 };
}

function getInfo(){
  
  const osType = os.type() === "Darwin" ? "MacOs" : os.type();
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const cpuModel = cpus[0].model;
  const numThreads = cpus.length;
  const clockSpeed = cpus[0].speed;
  return {
    osType,
    totalMem: Math.floor(totalMemory/ (1024**3)),
    cpuModel,
    numCores : numThreads /2 ,
    numThreads,
    clockSpeed,
  }
}

function getCpuAverage() {
 const cpusData = os.cpus();
 let idleMs = 0;
 let totalMs = 0;
 cpusData.forEach((thread) => {
   totalMs += Object.values(thread.times).reduce((acc, val) => acc + val, 0);
   idleMs += thread.times.idle;
 });
 return {
   idleAvg: idleMs / cpusData.length,
   totalAvg: totalMs / cpusData.length,
 };
}

function getCpuLoad() {
 return new Promise((resolve, reject) => {
   const start = getCpuAverage();
   setTimeout(() => {
     const end = getCpuAverage();
     const idleDifference = end.idleAvg - start.idleAvg;
     const totalDifference = end.totalAvg - start.totalAvg;
     //idle/total will give the ratio of idle usage (idle in ms / total in ms)
     const cpuPercentage =
       100 - Math.floor(100 * (idleDifference / totalDifference));
     resolve(cpuPercentage);
   }, 200);
 });
}

module.exports = {getPerformanceData, getInfo};