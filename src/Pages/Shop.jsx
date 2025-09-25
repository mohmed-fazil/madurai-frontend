import React, { useContext } from 'react';
import Hero from '../Components/Hero/Hero';
import Offers from '../Components/Offers/Offers';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item'; // We'll use the Item component to display products

const Shop = () => {
    // Get all products directly from the context
    const { all_products } = useContext(ShopContext);

    return (
        <div>
            <Hero />
            {/* We can create a "Popular" section by slicing the all_products array */}
            <div className='popular'>
                <h1>POPULAR ITEMS</h1>
                <hr />
                <div className="popular-item">
                    {all_products.slice(0, 4).map((item) => {
                        return <Item key={item._id} data={item} />
                    })}
                </div>
            </div>
            <Offers />
            {/* We can create a "New Collections" section with more items */}
            <div className='new-collections'>
                <h1>NEW ADDITIONS</h1>
                <hr />
                <div className="collections">
                    {all_products.slice(4, 8).map((item) => {
                        return <Item key={item._id} data={item} />
                    })}
                </div>
            </div>
            <NewsLetter />
        </div>
    );
};

export default Shop;
