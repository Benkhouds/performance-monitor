const Machine = require("./models/Machine");

function main(io, socket) {
  console.log(`socket ${socket.id} has connected`);
  let macAddress;

  //auth
  socket.on("clientAuth", (key) => {
    if (key === "nodeClientKey") {
      socket.join("clients");
    } else if (key === "reactClientKey") {
      socket.join("ui");
      //sending initialData
      console.log('connected')
      Machine.find()
        .then((machines) => {
          console.log(machines)
          socket.emit("initialData", machines);
        })
        .catch(console.log);
    } else {
      socket.disconnect(true);
    }
  });

  //checking if the machine is registered and adding it to the database
  socket.on("initialData", async (data) => {
    macAddress = data.macAddress;
    try {
      await findByMacAddressOrAdd(data);
    } catch (error) {
      throw new Error(error);
    }
  });
  //sending data to ui clients
  socket.on("perfData", (data) => {
    console.log(data)
    io.to("ui").emit("perfData", {...data, online: true});
  });
  
  socket.on("disconnect", () => {
    if(socket.rooms.has('ui')){
      socket.to("ui").emit("perfData", { macAddress, online:false });
    }else{
      console.log('force disconnect')
    }
  });
}



async function findByMacAddressOrAdd(data) {
  try {
    const result = await Machine.findOne({ macAddress: data.macAddress });
    console.log(result);
    if (!result) {
      await Machine.create({
        macAddress: data.macAddress,
        totalMem: data.totalMem,
        osType: data.osType,
        cpuModel: data.cpuModel,
        clockSpeed: data.clockSpeed,
        numCores: data.numCores,
        numThreads: data.numThreads,
      });
      return true;
    } else {
      return true;
    }
  } catch (err) {
    throw err;
  }
}

module.exports = main;
