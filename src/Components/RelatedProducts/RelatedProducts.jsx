import React, { useContext } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { ShopContext } from '../../Context/ShopContext'

const RelatedProducts = () => {
    // FIX: Get product data from the context instead of a static file
    const { all_products } = useContext(ShopContext);

    return (
        <div className='relatedproducts'>
            <h1>Related Products</h1>
            <hr />
            <div className="relatedproducts-item">
                {/* Slice the array to show a few related items */}
                {all_products.slice(0, 4).map((item, i)=>{
                    // FIX: Pass the entire item object as a single 'data' prop
                    return <Item key={i} data={item}/>
                })}
            </div>
        </div>
    )
}

export default RelatedProducts
