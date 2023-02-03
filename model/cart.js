import mongoose from 'mongoose'

const CatySchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    productname: {
        type: String,
    },
    productImage: {
        type: Array,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number
    },
}, {
    timestamps: true
})

let Cart = mongoose.models.Cart || mongoose.model('Cart', CatySchema)
export default Cart