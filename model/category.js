import mongoose from 'mongoose'

const CategoriesSchema = new mongoose.Schema( {
    name: {
        type: String,
    }
}, {
    timestamps: true
})

let Category = mongoose.models.Category || mongoose.model('Category', CategoriesSchema)
export default Category