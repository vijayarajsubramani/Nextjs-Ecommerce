import connectDB from '../common/mongod';
import Address from '../model/address';
import User from '../model/user';
const ObjectID = require('mongodb').ObjectId;
connectDB();

export const createAddress = async (reqbody) => {
    try {
        const userdetails = await User.findOne({ $and: [{ _id: ObjectID(reqbody.buyerId) }, { isActive: true }] });
        if (!userdetails) {
            return { statusCode: 400, status: 'error', message: 'Seller is not Active' }
        }
        let address = Address(reqbody);
        const addressCount = await Address.find({ buyerId: ObjectID(reqbody.buyerId) });
        if (addressCount.length === 5) {
            return { statusCode: 400, status: 'error', message: 'Maximum Address limit is 5' }
        }
        const addressList = await Address.findOne({ buyerId: ObjectID(reqbody.buyerId) });
        const addressDetails = await address.save()
        if (reqbody.isDefaultAddress) {
            await Address.updateMany({ buyerId: ObjectID(reqbody.buyerId), _id: { $ne: ObjectID(addressList._id.toString(), { isDefaultAddress: false }) } })
        }
        return { statusCode: 200, status: 'success', message: 'Successfully added Address', data: addressDetails }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
}
export const updateAddress = async (reqbody) => {
    try {
        const address = await Address.find({ _id: ObjectID(reqbody.addressId) });
        if (address.length === 0) {
            return { statusCode: 400, status: 'error', message: 'Address not Found' }
        }
        await Address.updateOne({ _id: ObjectID(reqbody.addressId) }, reqbody)
        if (reqbody.isDefaultAddress) {
            await Address.updateMany({ buyerId: ObjectID(reqbody.buyerId), _id: { $ne: ObjectID(addressList._id.toString(), { isDefaultAddress: false }) } })
        } return { statusCode: 200, status: 'success', message: 'Successfully updated Address', data: address }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
}
export const getAddressbyId = async (reqbody) => {
    try {
        const address = await Address.findOne({ _id: ObjectID(reqbody.addressId) });
        if (!address) {
            return { statusCode: 400, status: 'error', message: 'Address not Found' }
        }
        return { statusCode: 200, status: 'success', message: 'Successfully fetched Address', data: address }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
}
export const getSellerAddress = async (reqbody) => {
    try {
        const address = await Address.find({ buyerId: ObjectID(reqbody.buyerId) });
        if (address.length === 0) {
            return { statusCode: 400, status: 'error', message: 'Address not Found' }
        }
        return { statusCode: 200, status: 'success', message: 'Successfully fetched Address', data: address }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
}
export const deleteAddress = async (reqbody) => {
    try {
        const address = await Address.findOne({ _id: ObjectID(reqbody.addressId), buyerId: ObjectID(reqbody.buyerId) });
        if (address.length === 0) {
            return { statusCode: 400, status: 'error', message: 'Address not Found' }
        }
        await address.remove()
        return { statusCode: 200, status: 'success', message: 'Successfully deleted Address' }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
}