const { ProductModel } = require("../models/productsModel")
const orderModel = require("../models/orderModel")
const placeOrder = async (req, res) => {
    try {
        const { userID, productId, quantity, shippingAddress, paymentMethod, upiId } = req.body;

        if (!userID || !productId || quantity < 1 || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let existingOrder = await orderModel.findOne({ user: userID });

        if (existingOrder) {

            if (existingOrder.shippingAddress.addressLine1 === shippingAddress.addressLine1) {
                
                let productIndex = existingOrder.products.findIndex(p => p.product.toString() === productId);

                if (productIndex > -1) {
                    existingOrder.products[productIndex].quantity += quantity;
                } else {
                    existingOrder.products.push({ product: productId, quantity, price: product.price });
                }

                existingOrder.subtotal += product.price * quantity;
                existingOrder.tax = existingOrder.subtotal * 0.1;
                existingOrder.total = existingOrder.subtotal + existingOrder.tax + existingOrder.shippingCost;

                await existingOrder.save();

                return res.status(200).json({ message: "Order updated successfully", order: existingOrder });
            }

        }

        const orderTotal = product.price * quantity;
        const tax = orderTotal * 0.1;
        const shippingCost = 50;

        const orderData = new orderModel({
            user: userID,
            products: [{ product: productId, quantity, price: product.price }],
            shippingAddress,
            paymentMethod,
            paymentDetails: paymentMethod === 'upi' ? { upiId, paymentStatus: 'pending' } : {},
            subtotal: orderTotal,
            tax,
            shippingCost,
            total: orderTotal + tax + shippingCost,
            orderStatus: 'pending'
        });

        await orderData.save();

        res.status(201).json({ message: "Order placed successfully", order: orderData });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const removeOrder = async (req, res) => {
    const { id } = req.params
    const existOrder = await orderModel.findById(id)
    if (!existOrder) {
        res.status(404).json({
            message: "Order not found"
        })
    }
    await orderModel.findByIdAndDelete(id)
    res.status(200).json({
        message: "Order deleted"
    })
}
module.exports = { placeOrder }