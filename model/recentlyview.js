const mongoose = require('mongoose');

const recentlySchema = mongoose.Schema(
    {
        buyerId: {
            type: String,
        },
        productId: {
            type: String,
        },
        productSellerId:{
            type: String,
        },
        categoryId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const RecentlyView = mongoose.models.RecentlyView || mongoose.model('UserActivity', recentlySchema)
export default RecentlyView