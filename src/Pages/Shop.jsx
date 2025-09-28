import React, { useContext } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import { ShopContext } from '../Context/ShopContext';

const Shop = () => {
    const { all_products } = useContext(ShopContext);

    return (
        <div>
            <Hero />
            {/* FIX: Use the Popular component and pass the sliced data to it */}
            <Popular data={all_products.slice(0, 4)} />
            <Offers />
            {/* FIX: Use the NewCollections component and pass the sliced data to it */}
            <NewCollections data={all_products.slice(4, 12)} />
            <NewsLetter />
        </div>
    );
};

export default Shop;
