const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        orderNo: {
            type: String,
        },
        orderStatus: {
            type: String,
        },
        paymentMethod: {
            type: Boolean,
            default: true
        },
        sellerId: {
            type: String,
        },
        orderDate: {
            type: Date,
        },
        paymentMethod: {
            type: String,
        },
        deliveryAmount: {
            type: Number,
        },
        subTotal: {
            type: Number,
        },
        totalAmount: {
            type: Number,
        },
        shippingAddress: {
            type: Object,
        },
        deliveryAddress: {
            type: Object,
        },
        productDetails: {
            type: Array,
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
export default Order
