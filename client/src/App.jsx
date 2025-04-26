// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Dashboard from "./pages/shopkeeper/dashboard";
import Products from "./pages/shopkeeper/products";
import Sales from "./pages/shopkeeper/Sales/Sales";
import GlobalStyle from "./GlobalStyle";
import ProtectedRoute from "./components/ProtectedRoute";
import ShopkeepersPage from "./pages/admin/shopkeepers/shopkeepers";
import Form from "./pages/shopkeeper/Form";
import UpdateForm from "./pages/shopkeeper/Form/updateForm";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";

import Home from "./pages/user/userHome/home";
import Cart from "./pages/user/Cart";
import ProductDetails from "./pages/user/ProductDetails";
import PlaceOrder from "./pages/user/placeOrder/Order";
import Orders from "./pages/user/orders/order";
const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*">
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="getShopkeepers" element={<ShopkeepersPage />} />
            </Route>
          </Route>
          {/* shopkeeper routes */}
          <Route path="/shopkeeper/*" element={<ProtectedRoute />}>
            <>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<Form />} />
              <Route path="update-product/:id" element={<UpdateForm />} />
              <Route path="sales" element={<Sales />} />
            </>
          </Route>

          {/* user routes */}
          <Route path="/user/*" element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order/:id" element={<PlaceOrder />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
