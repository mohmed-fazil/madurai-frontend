import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    // Get user, logout function, and cart items count from context
    const { user, logout, getTotalCartItems } = useContext(ShopContext);

    const menuRef = useRef();

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    const handleLogout = () => {
        logout(); // Use the logout function from the context
        window.location.replace("/");
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
                <li onClick={() => { setMenu("Menu") }}><Link to='/Menu' style={{ textDecoration: 'none' }}>Menu</Link>{menu === "Menu" ? <hr /> : <></>}</li>
            </ul>
            <div className="nav-login-cart">
                {/* Check for user object from context instead of localStorage */}
                {user
                    ? <button onClick={handleLogout}>Logout</button>
                    : <Link to='/login' style={{ textDecoration: 'none' }}><button>Login</button></Link>}
                <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar
