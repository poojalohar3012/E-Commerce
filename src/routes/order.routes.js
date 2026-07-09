const express = require("express");
const router = express.Router();

const { placeOrder,getMyOrders,updateOrder,deleteOrder, getOrderById,getAllOrders,updateOrderStatus } = require("../controllers/order.controller");

const { protect,authorize } = require("../middleware/auth.middleware");

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllOrders
);

router.patch("/:id/status",protect,authorize("admin"),updateOrderStatus)

router.get("/:id",protect,getOrderById)

router.put("/:id", protect, updateOrder);

router.delete("/:id", protect, deleteOrder);

module.exports = router;