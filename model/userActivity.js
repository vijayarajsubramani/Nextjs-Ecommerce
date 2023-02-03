import mongoose from 'mongoose'

const userActivity = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    activityType:{
        type: String,
    },
    typeId:{
        type: String,
    },
    sellerId: {
        type: String, 
    }

}, {
    timestamps: true
})

const UserActivity = mongoose.models.UserActivity || mongoose.model('UserActivity', userActivity)
export default UserActivity