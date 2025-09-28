import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {
    let [menu, setMenu] = useState("shop");
    const { user, logout, getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    return (
        <div className='nav'>
            <Link to='/' onClick={() => { setMenu("shop") }} style={{ textDecoration: 'none' }} className="nav-logo">
                <img src={logo} alt="logo" />
                <p>MADURAI SPECIAL</p>
            </Link>
            <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => { setMenu("shop") }}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("Offers") }}><Link to='/Offers' style={{ textDecoration: 'none' }}>Offers</Link>{menu === "Offers" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("Combos") }}><Link to='/Combos' style={{ textDecoration: 'none' }}>Combos</Link>{menu === "Combos" ? <hr /> : <></>}</li>
                {/* Only show "My Orders" if the user is logged in */}
                {user && <li onClick={() => { setMenu("myorders") }}><Link to='/myorders' style={{ textDecoration: 'none' }}>My Orders</Link>{menu === "myorders" ? <hr /> : <></>}</li>}
            </ul>
            <div className="nav-login-cart">
                {user
                    ? <button onClick={logout}>Logout</button>
                    : <Link to='/login' style={{ textDecoration: 'none' }}><button>Login</button></Link>}
                <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar
