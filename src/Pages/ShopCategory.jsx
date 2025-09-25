import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from "../Components/Item/Item";
import { ShopContext } from "../Context/ShopContext";

const ShopCategory = (props) => {
    // Get all products from the context instead of fetching locally
    const { all_products } = useContext(ShopContext);

    return (
        <div className="shopcategory">
            <img src={props.banner} className="shopcategory-banner" alt="" />
            <div className="shopcategory-indexSort">
                <p><span>Showing all available items</span></p>
                <div className="shopcategory-sort">Sort by <img src={dropdown_icon} alt="" /></div>
            </div>
            <div className="shopcategory-products">
                {all_products.map((item, i) => {
                    // Note: The category filter from your original code is removed
                    // because our backend items don't have a 'category' field.
                    // We are displaying all items from the selected vendor.
                    return <Item 
                                key={i} 
                                id={item._id} // Use _id from MongoDB
                                name={item.name} 
                                image={item.imageUrl} // Use imageUrl from backend
                                new_price={item.price} // Use price from backend
                                old_price={item.price} // old_price doesn't exist, so we use price
                            />;
                })}
            </div>
            <div className="shopcategory-loadmore">
                Explore More
            </div>
        </div>
    );
};

export default ShopCategory;
