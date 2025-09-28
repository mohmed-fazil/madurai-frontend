import React from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = (props) => {
  return (
    <div className='popular'>
      <h1>POPULAR IN STORE</h1>
      <hr />
      <div className="popular-item">
        {props.data.map((item,i)=>{
            // FIX: Pass the entire item object as a single 'data' prop
            return <Item key={i} data={item}/>
        })}
      </div>
    </div>
  )
}

export default Popular
