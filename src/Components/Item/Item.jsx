// ./Components/Item/Item.jsx

import React, { useContext } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext'; // Import the context

const Item = (props) => {
  const { addToCart } = useContext(ShopContext); // Get the addToCart function

  return (
    <div className='item'>
      {/* FIX: onClick now uses a function to prevent immediate execution */}
      <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0, 0)}>
        <img src={props.image} alt={props.name} />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">₹{props.new_price}</div>
        <div className="item-price-old">₹{props.old_price}</div>
      </div>
      {/* ADDED: Add to Cart button */}
      <button className='item-add-button' onClick={() => addToCart(props.id)}>
        Add to Cart
      </button>
    </div>
  );
}

export default Item;