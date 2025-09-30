import React, { useContext } from 'react';
import Hero from '../Components/Hero/Hero';
import Offers from '../Components/Offers/Offers';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';

// Reusing styles from ShopCategory for a consistent look and feel
import './CSS/ShopCategory.css'; 

const Shop = () => {
    const { all_products } = useContext(ShopContext);

    return (
        <div className="shop-page">
            <Hero />
            {/* Using the same layout as ShopCategory to display menu items */}
            <div className="shopcategory">
                <div className="shopcategory-indexSort">
                    <p><span>Showing all Menu items</span></p>
                </div>
                <div className="shopcategory-products">
                    {all_products.map((item, i) => {
                        // This 'if' statement filters to show only 'Menu' items
                        if (item.category === 'Menu') {
                            return <Item key={i} data={item} />;
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
            <Offers />
            <NewsLetter />
        </div>
    );
};

export default Shop;
