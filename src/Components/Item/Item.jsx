import React, { useContext } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Item = (props) => {
    const { addToCart } = useContext(ShopContext);

    // This checks if props.data exists before trying to destructure it.
    if (!props.data) {
        return null; // Or return a loading spinner, or some placeholder
    }

    // Use property names that match our backend's data model
    const { _id, name, imageUrl, price } = props.data;

    return (
        <div className='item'>
            <Link to={`/product/${_id}`} onClick={() => window.scrollTo(0, 0)}>
                <img src={imageUrl} alt={name} />
            </Link>
            <p>{name}</p>
            <div className="item-prices">
                <div className="item-price-new">₹{price}</div>
            </div>
            <button className='item-add-button' onClick={() => addToCart(_id)}>
                Add to Cart
            </button>
        </div>
    );
}

export default Item;
