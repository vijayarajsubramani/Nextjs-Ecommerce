const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema(
    {
        buyerId: {
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
let Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema)
module.exports = Favorite;
