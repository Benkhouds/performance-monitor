
import {useRef, useEffect} from 'react'


function getColor(percentage){
    if(percentage < 20){
           
        return '#00ff43';
    }else if(percentage < 40){
        return '#f0ad4e';
    }else if(percentage < 60){
        return '#f5ad4f';
    }else{
        return '#d9534f';
    }
}

function Circle({percentage}) {  


  const circleBorder = useRef()
  
  useEffect(()=>{  
    const circumference = circleBorder.current.getTotalLength();  
    circleBorder.current.style.strokeDashoffset = (circumference + 1) - (percentage / 100) * circumference;
    circleBorder.current.style.stroke= getColor(percentage) ; 

  },[percentage])

   
 return (
    <svg >
        <circle cx="70" cy="70" r="70"></circle>
        <circle cx="70" cy="70" r="70" ref={circleBorder}></circle>
    </svg>        
 )
}

export default Circle
