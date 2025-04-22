const express = require("express");
const router = express.Router();

const { upload, addProduct, getAllProducts, getByID, updateProduct, deleteById, getUsers, getOrdersByShopkeeper, updateOrderStatus, getShopkeepers, deleteShopkeeper } = require('../controllers/productControllers');

router.post("/create", upload.single('image'), addProduct);
router.get("/products/:id", getAllProducts);
router.get("/product/:id", getByID)
router.delete("/product/:id", deleteById)
router.put("/product/:id", updateProduct)

router.get("/users", getUsers)
router.get("/orders/:shopkeeperID",getOrdersByShopkeeper)
router.put("/orders/:orderId/status", updateOrderStatus)
router.get("/getShopkeepers", getShopkeepers)
router.delete("/shopkeepers/:id", deleteShopkeeper)
module.exports = router;
