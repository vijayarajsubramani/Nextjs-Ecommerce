import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    district: {
        type: String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    pincode: {
        type: String,
    },
    mobile:{
        type: Number
    },
    addressType: {
        type: String,
        default:'office'
    },
    isDefaultAddress: {
        type: Boolean
    }
}, {
    timestamps: true
})

let Address = mongoose.models.Address || mongoose.model('Address', AddressSchema)
export default Address