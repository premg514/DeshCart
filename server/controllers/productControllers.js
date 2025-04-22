const { ProductModel, AddCartModel } = require("../models/productsModel")
const userModel = require("../models/credentialModel")
const Order = require("../models/orderModel")
require("dotenv").config()
const multer = require('multer')
const path = require("path")
const CredentialModel = require("../models/credentialModel")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

const addProduct = async (req, res) => {
    const product = req.body
    console.log(product)

    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No image uploaded"
            });
        }
        if (req.file) {
            const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
            product.image = `${BASE_URL}/uploads/` + req.file.filename
        }

        const createProduct = new ProductModel(product)
        await createProduct.save()
        res.status(201).json({
            message: "Product created successfully!"
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: e

        })
    }

}

const getAllProducts = async (req, res) => {
    const { id } = req.params;
    const { search, page = 1, limit = 8, category } = req.query;

    try {
        // Base query
        let query = {};

        // Filter by shopkeeper ID if it's not '1' (which means all products)
        if (id !== '1') {
            query.shopkeeperID = id;
        }

        // Add search filter if provided
        if (search) {
            query = {
                ...query,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Add category filter if provided
        if (category && category !== 'AllCategories') {
            query.category = category;
        }

        // Calculate pagination values
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const products = await ProductModel
            .find(query)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination info
        const totalProducts = await ProductModel.countDocuments(query);

        res.status(200).json({
            message: "Products retrieved successfully",
            products,
            pagination: {
                total: totalProducts,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalProducts / limitNum)
            }
        });
   
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({
            error: "Failed to retrieve products",
            details: error.message
        });
    }
};

const getByID = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            product
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    try {
        const existedproduct = await ProductModel.findById(id);
        if (!existedproduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updating = await ProductModel.findByIdAndUpdate(id, product)
        res.status(200).json({
            updating
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const deleting = await ProductModel.findByIdAndDelete(id)
        res.status(200).json({
            message: "product is deleted",
            product: deleting
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getUsers = async (req, res) => {

    try {
        const allUsers = await userModel.find()
        res.status(201).json({
            users: allUsers
        })
    } catch (e) {
        console.log(e)
    }
}

const addCart = async (req, res) => {
    const { id, quantity } = req.params
    const product = {
        productID: id,
        productQuantity: quantity
    }
    try {
        const existedProduct = await ProductModel.findById(id)
        if (!existedProduct) {
            return res.status(404).json({ message: "Product not found" })
        }
        const isInCart = await AddCartModel.findOne({ productID: id })

        if (isInCart) {
            return res.status(409).json({
                message: "This product already added in cart"
            })
        }
        const cart = new AddCartModel(product)
        await cart.save()
        res.status(201).json({
            message: "Product added to cart successfully!"
        })
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const getCartProducts = async (req, res) => {
    try {
        const allProducts = await AddCartModel.find()
        res.status(200).json({
            products: allProducts
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }


}

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params
        await AddCartModel.findByIdAndDelete(id)
        res.status(200).json({
            message: "product is deleted",
        });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { id, quantity } = req.body;

        if (!id || quantity < 1) {
            return res.status(400).json({ message: "Invalid product ID or quantity" });
        }

        const updatedItem = await AddCartModel.findOneAndUpdate(
            { _id: id }, 
            { $set: { productQuantity: quantity } },
            { new: true }
        );
        

        if (!updatedItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart updated successfully", cartItem: updatedItem });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getOrdersByShopkeeper = async(req, res)=>{
    try{
        const {shopkeeperID} = req.params

         // Find all orders
         const orders = await Order.find({}).lean();

         // Extract product IDs from orders
         const orderedProductIds = orders.flatMap(order => order.products.map(p => p.product));
        
         // Find products that belong to the given shopkeeper
        const products = await ProductModel.find({
            _id: { $in: orderedProductIds },
            shopkeeperID
        }).lean();

        // Fetch users related to orders
        const userIds = [...new Set(orders.map(order => order.user))];
        const users = await CredentialModel.find({ _id: { $in: userIds } }).lean();
        // Map products with corresponding orders and users
        const shopkeeperOrders = orders.map(order => {
            const user = users.find(u => u._id.toString() === order.user.toString());
            return {
                orderId: order._id,
                user: user ? { userId: user._id, name: user.name, email: user.email } : null,
                shippingAddress: order.shippingAddress,
                products: order.products.filter(p =>
                    products.some(prod => prod._id.toString() === p.product.toString())
                ),
                orderStatus:order.orderStatus
               
            };
        }).filter(order => order.products.length > 0);

        res.status(200).json({ success: true, data: shopkeeperOrders });

    }catch(e){
        console.log(e)
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        // Validate input
        if (!orderStatus) {
            return res.status(400).json({ message: "Order status is required" });
        }

        // Find the order by ID and update its status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true } // Return updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getOrders = async (req, res) => {
    try {
        const { userID } = req.params;

        // Fetch orders for the given userID
        const orders = await Order.find({ user: userID });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        // Fetch product details for each order
        const ordersWithProductDetails = await Promise.all(
            orders.map(async (order) => {
                const productDetails = await Promise.all(
                    order.products.map(async (item) => {
                        const product = await ProductModel.findById(item.product);
                        return {
                            _id: item._id,
                            productId: item.product,
                            name: product?.name || "Unknown Product",
                            description: product?.description || "No description available",
                            image: product?.image || null,
                            quantity: item.quantity,
                            price: item.price
                        };
                    })
                );

                return {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    user: order.user,
                    products: productDetails,
                    shippingAddress: order.shippingAddress,
                    paymentMethod: order.paymentMethod,
                    paymentDetails: order.paymentDetails,
                    subtotal: order.subtotal,
                    tax: order.tax,
                    shippingCost: order.shippingCost,
                    total: order.total,
                    orderStatus: order.orderStatus,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                };
            })
        );

        res.status(200).json({ orders: ordersWithProductDetails });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const getShopkeepers = async (req, res) => {
    try {
        const shopkeepers = await CredentialModel.find({ role: "shopKeeper" });

        if (shopkeepers.length === 0) {
            return res.status(404).json({ message: "No shopkeepers found" });
        }

        res.status(200).json({shopkeepers});
    } catch (error) {
        console.error("Error fetching shopkeepers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const deleteShopkeeper =  async (req, res) => {
    try {
        const { id } = req.params;

        // Find the shopkeeper
        const shopkeeper = await CredentialModel.findOne({ _id: id, role: "shopKeeper" });

        if (!shopkeeper) {
            return res.status(404).json({ message: "Shopkeeper not found" });
        }

        // Delete the shopkeeper
        await CredentialModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Shopkeeper deleted successfully" });
    } catch (error) {
        console.error("Error deleting shopkeeper:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { upload, addProduct, getAllProducts, getByID, updateProduct, deleteById, getUsers, addCart, getCartProducts, deleteCartItem, updateCartItem ,getOrdersByShopkeeper, updateOrderStatus, getOrders, getShopkeepers, deleteShopkeeper}