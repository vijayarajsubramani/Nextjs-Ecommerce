const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema(
    {
        token: {
            type: String,
        },
        userId: {
            type: String,
        },
        isactive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);

const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema)
export default Token
