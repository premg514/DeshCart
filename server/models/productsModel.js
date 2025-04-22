const mongoose = require("mongoose");

const schemaRules = {
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Electronics", "Clothing", "Groceries", "Food", "Home", "Vegetables", "Beauty", "Sports", "Other"],
        default: "Other"
    },
    stockStatus: {
        type: String,
        enum: ["In Stock", "Out of Stock"],
        default: "In Stock"
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    shopkeeperID: {
        type: String,
        required: [true, "shopkeeper need to control products"]
    }

};
const addCart = {
    productID: {
        type: String,
        required: [true, "user need to control products"]
    },
    productQuantity: {
        type: Number,
        required: [true, "product quantity need to add to cart"]
    }
}
const addtoCart = new mongoose.Schema(addCart, { timestamps: true })
const productSchema = new mongoose.Schema(schemaRules, { timestamps: true });

const AddCartModel = mongoose.model('AddCartModel', addtoCart)
const ProductModel = mongoose.model('ProductModel', productSchema);

module.exports = { ProductModel, AddCartModel };
