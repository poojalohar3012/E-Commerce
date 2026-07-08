const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${item.product.name} is out of stock`,
                });
            }

            totalPrice += item.product.price * item.quantity;

            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
            });
        }

        const { shippingAddress, paymentMethod } = req.body;

        const order = await Order.create({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        // Reduce stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: {
                    stock: -item.quantity,
                },
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    placeOrder,
    getMyOrders
};