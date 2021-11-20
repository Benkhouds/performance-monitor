import Circle from "./Circle"

function Cpu({cpuLoad}) {
 return (
  <div className="status-card card">
       <div className="box">
          <div className="circle-container">
              <Circle percentage={cpuLoad}/>
          <div className="percentage">
                      <h5> {cpuLoad} <span>%</span></h5>
              </div>
              <h3 className="circle-title">CPU</h3>
          </div>
       </div>
   </div>   
 )
}

export default Cpu
