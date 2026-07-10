const asyncHandler = require("../utils/asyncHandler");
const paymentService = require("../services/payment.service");

const createOrder = asyncHandler(async (req, res) => {

    const { amount } = req.body;

    const order = await paymentService.createRazorpayOrder(amount);

    res.status(200).json({
        success: true,
        data: order,
    });
});

module.exports = {
    createOrder,
};