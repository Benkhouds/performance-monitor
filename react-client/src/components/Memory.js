import Circle from './Circle'

function Memory({memoryUsage}) {
 return (
  <div className="status-card card">
       <div className="box">
          <div className="circle-container">
              <Circle percentage={memoryUsage}/>
          <div className="percentage">
                      <h5> {memoryUsage} <span>%</span></h5>
              </div>
              <h3 className="circle-title">Memory Usage</h3>
          </div>
       </div>
   </div>
 )
}

export default Memory
