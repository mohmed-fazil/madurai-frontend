import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from "../Components/Item/Item";
import { ShopContext } from "../Context/ShopContext";

const ShopCategory = (props) => {
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
                    // FIX: Pass the entire item object as a single 'data' prop
                    return <Item key={i} data={item} />;
                })}
            </div>
            <div className="shopcategory-loadmore">
                Explore More
            </div>
        </div>
    );
};

export default ShopCategory;
