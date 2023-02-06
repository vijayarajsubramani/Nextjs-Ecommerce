const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema(
    {
        sellerId: {
            type: String,
        },
        productId: {
            type: String,
        },
        favoriteType: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
let FavoriteProduct = mongoose.models.FavoriteProduct || mongoose.model('FavoriteProduct', favoriteSchema)
module.exports = FavoriteProduct;
