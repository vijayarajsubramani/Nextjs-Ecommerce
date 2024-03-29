import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: Array,
    },
    categoryname: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    productStatus: {
        type: String,
        default: "PENDING",
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    salesCount: {
        type: Number,
        default: 0
    },
    isProductDeleted: {
        type: Boolean,
        default: false
    },
    isSellerActive: {
        type: Boolean,
        default: true
    },
    isBulkUpload:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

let Product = mongoose.models.Product || mongoose.model('Product', productSchema)
export default Product
