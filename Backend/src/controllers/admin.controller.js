const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


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


        res.status(200).json({

            success: true,

            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: revenue[0]?.total || 0
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

        const users = await User.find()
        .select("-password");


        res.status(200).json({

            success:true,
            users

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




module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getOrderById
};