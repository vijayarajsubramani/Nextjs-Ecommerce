const mongoose = require('mongoose');

const orderMasterSchema = mongoose.Schema(
    {
        orderNo: {
            type: String,
        },
        orderStatus: {
            type: String,
        },
        sellerId: {
            type: String,
        },
        orderDate: {
            type: Date,
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
        orderList: {
            type: Object,
        },
    },
    {
        timestamps: true,
    }
);

const OrderMaster = mongoose.models.OrderMaster || mongoose.model('OrderMaster', orderMasterSchema)
export default OrderMaster
