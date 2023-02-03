import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    avatar: {
        type: String,
        default: 'https://api.multiavatar.com/ng.svg'
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User