import Info from "./Info";
import Memory from "./Memory";
import Cpu from "./Cpu";
import { useEffect, useState } from "react";
import socket from "../utils/socket";

const initialState = {
   uptime: 0,
   usedMem: 0,
   freeMem: 0,
   memoryUsage: 0,
   cpuLoad: 0, 
};

function Widget({ info }) {
  const [perfData, setPerfData] = useState({});
  const [offline, setOffline] = useState(true);

  useEffect(() => {
    socket.on("perfData", (data) => {
       console.log(data)
      if (data.macAddress === info.macAddress) {
        if (data.online) {
          setPerfData(data);
          setOffline(false);
        } else {
          setPerfData({...initialState, macAddress :info.macAddress});
          setOffline(true);
        }
      }
    });
  }, [info]);

  return (
    <div className="container">
       {offline ? <div className="offline">Offline </div>: ""}
      <Cpu cpuLoad={offline ? 0 : perfData.cpuLoad} />
      <Memory memoryUsage={offline ? 0 :perfData.memoryUsage} />
      <Info info={info} uptime={perfData.uptime || 0} />
    </div>
  );
}

export default Widget;
