const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
} = require("../controllers/order.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

module.exports = router;