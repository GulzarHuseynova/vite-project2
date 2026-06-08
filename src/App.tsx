import {Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import Home from "./pages/Home/Home";
import ProductDetail from "./pages/ProductDetail/ProductDetail";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Product />} />
            <Route path="/Productdetail/:id" element={<ProductDetail />} />
        </Routes>
    );
};

export default App;