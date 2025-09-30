import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
// You can create a specific banner image for your combo deals
import combo_banner from "./Components/Assets/banner.png"; 
import LoginSignup from "./Pages/LoginSignup";
import MyOrders from "./Pages/MyOrders";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          {/* This is the main shop page for "Menu" items */}
          <Route path="/" element={<Shop />} />
          {/* This route now specifically shows items with the category "Combo" */}
          <Route path="/combos" element={<ShopCategory banner={combo_banner} category="Combo" />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
