const express = require("express");

const router = express.Router();

const {
    protect,
    authorize
} = require("../middleware/auth.middleware");


const {
    getDashboardStats,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getOrderById

} = require("../controllers/admin.controller");



router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    getDashboardStats
);


router.get(
    "/users",
    protect,
    authorize("admin"),
    getAllUsers
);


router.get(
    "/orders",
    protect,
    authorize("admin"),
    getAllOrders
);

router.patch(
    "/orders/:id",
    protect,
    authorize("admin"),
    updateOrderStatus
);

router.get("/orders/:id", protect, authorize("admin"), getOrderById);

module.exports = router;