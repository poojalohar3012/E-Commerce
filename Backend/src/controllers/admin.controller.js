const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const adminService = require("../services/admin.services");


// Dashboard Statistics
const getDashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalPrice"
                    }
                }
            }
        ]);

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);


        res.status(200).json({

            success: true,

            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: revenue[0]?.total || 0,
                recentOrders
            }

        });


    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// Get All Users
const getAllUsers = async (req,res)=>{

    try {

        const result =
            await adminService.getAllUsers(
                req.query
            );


        res.status(200).json({

            success:true,
            ...result

        });


    } catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// Get All Orders
const getAllOrders = async(req,res)=>{

    try {

        const orders = await Order.find()
        .populate("user","name email")
        .sort({
            createdAt:-1
        });


        res.status(200).json({

            success:true,
            orders

        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};




// Update order status
const updateOrderStatus = async (req, res) => {

    const { orderStatus } = req.body;


    const order = await Order.findById(req.params.id);


    if (!order) {

        return res.status(404).json({

            success: false,
            message: "Order not found"

        });

    }


    order.orderStatus = orderStatus;


    if(orderStatus === "Delivered"){

        order.deliveredAt = new Date();

    }


    await order.save();


    res.status(200).json({

        success:true,
        message:"Order status updated",
        order

    });

};


const getOrderById = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("orderItems.product", "name price image");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUserRole = async (req, res) => {

    try {

        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        if (req.user.id === req.params.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role.",
            });
        }

        const user = await adminService.updateUserRole(
            req.params.id,
            role
        );

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    updateUserRole,
    getOrderById
};