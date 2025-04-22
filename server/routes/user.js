const express = require("express");
const router = express.Router();

const { upload, getAllProducts, getByID, getUsers, addCart, getCartProducts, deleteCartItem, updateCartItem, getOrders } = require('../controllers/productControllers');
const { placeOrder } = require("../controllers/orderController")
router.get("/products/:id", getAllProducts);
router.get("/product/:id", getByID)

router.get("/users", getUsers)
router.post("/add-cart/:id/:quantity", addCart)
router.get("/cart", getCartProducts)
router.delete("/cart/remove/:id", deleteCartItem)
router.put("/cart/update", updateCartItem)
router.post("/place-order", placeOrder)
router.get("/get-orders/:userID", getOrders)
module.exports = router;
