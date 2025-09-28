import React from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = (props) => {
  return (
    <div className='new-collections'>
      <h1>NEW OFFERS</h1>
      <hr />
      <div className="collections">
        {props.data.map((item,i)=>{
            // FIX: Pass the entire item object as a single 'data' prop
            return <Item key={i} data={item}/>
        })}
      </div>
    </div>
  )
}

export default NewCollections
