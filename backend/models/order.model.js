const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace with your customer model name
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Replace with your product model name
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1, // Ensure at least one item is ordered
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    country: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery', 'other'], // Add other payment methods if applicable
        default: 'cash_on_delivery',
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
