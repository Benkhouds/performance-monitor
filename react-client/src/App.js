import './styles/styles.css'
import Widget from './components/Widget'
import socket from './utils/socket'
import {useEffect, useState} from 'react'
function App() {
   
  const [machines , setMachines] = useState([])

  useEffect(()=>{
   console.log('in')
    socket.on('initialData', (arr)=>{
      console.log(arr)
       setMachines(arr)
    })

  },[])

  return (
   <div className="parent-container">
     {machines.length ?      
       machines.map((m)=><Widget key={m.macAddress} info={m} />)
       :
       ''
    }
      
   </div>
  );
}

export default App;
