import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ProductDetails from "../pages/ProductDetails";

import AdminRoute from "../components/AdminRoute";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";

import AdminOrderDetails from "../pages/admin/AdminOrderDetails";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />

                    <Route path="/products/:id" element={<ProductDetails />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/cart" element={<Cart />} />

                    <Route path="/checkout" element={<Checkout />}/>

                    <Route path="/myorders" element={<MyOrders />}/>

                     <Route path="/orders/:id" element={<OrderDetails />}/>
              
                    <Route path="/profile" element={<Profile />}/>

                </Route>

                 <Route
                    element={
                     <AdminRoute>
                       <AdminLayout />
                     </AdminRoute>
                     }
                >
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/products/add" element={<AddProduct />} />
                    <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                    <Route path="/admin/orders" element={<Orders />} />
                    <Route path="/admin/orders/:id"  element={<AdminOrderDetails />} />
                    <Route path="/admin/users" element={<Users />} />
                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;