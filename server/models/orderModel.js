const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
    },
    addressLine1: {
        type: String,
        required: [true, 'Address line 1 is required']
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'India'
    }
});
// Order Schema
const OrderSchema = new Schema({
    user: {
        type: String,
        required: [true, 'User ID is required']
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product ID is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        price: {
            type: Number,
            required: [true, 'Price is required']
        }
    }],
    shippingAddress: {
        type: AddressSchema,
        required: [true, 'Shipping address is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: ['upi', 'cod'],
        default: 'cod'
    },
    paymentDetails: {
        upiId: {
            type: String,
            required: function () {
                return this.paymentMethod === 'upi';
            }
        },
        transactionId: String,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    },
    subtotal: {
        type: Number,
        required: [true, 'Subtotal is required']
    },
    tax: {
        type: Number,
        required: [true, 'Tax is required']
    },
    shippingCost: {
        type: Number,
        required: [true, 'Shipping cost is required']
    },
    total: {
        type: Number,
        required: [true, 'Total is required']
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderNumber: {
        type: String,
        unique: true
    },
    deliveryNotes: String,
    estimatedDeliveryDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate unique order number before saving
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        // Generate order number: ORD-YYYYMMDD-XXXX (where XXXX is a random number)
        const date = new Date();
        const dateStr = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        this.orderNumber = `ORD-${dateStr}-${randomNum}`;
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', OrderSchema);