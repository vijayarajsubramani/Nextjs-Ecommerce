import connectDB from '../common/mongod';
import User from '../model/user'
import Token from '../model/token';
import { createAccessToken } from '../common/geneToeken'
import Product from '../model/product';
import Cart from '../model/cart';
const ObjectID = require('mongodb').ObjectId;

const bcrypt = require('bcryptjs');
connectDB();


export const getallUser = async (reqbody) => {
    try {
        let aggregatePipeline = [];
        let filter_obj = {};
        let sort_obj = reqbody.sortObj;
        const page = reqbody.page || 1;
        const limit = reqbody.limit || 10;
        const skip = (page - 1) * limit;
        if (reqbody.filterObj?.field === 'all' && reqbody.filterObj?.value !== '') {
            filter_obj = {
                $or: [
                    { name: { $regex: reqbody.filterObj.value, $options: 'i' } },
                    { email: { $regex: reqbody.filterObj.value, $options: 'i' } },
                    { mobile: { $regex: reqbody.filterObj.value, $options: 'i' } },
                ]
            }
        }
        if (reqbody.filterObj?.role) {
            filter_obj.role = reqbody.filterObj.role
        }
        if (reqbody.filterObj?.isActive) {
            filter_obj.isActive = reqbody.filterObj.isActive
        }

        if (Object.entries(filter_obj).length !== 0) {
            const filter = { $match: filter_obj }
            aggregatePipeline.push(filter)
        }
        if (sort_obj) {
            const sort_app = { $sort: sort_obj }
            aggregatePipeline.push(sort_app)

        }
        aggregatePipeline.push({ $project: { "_id": 1, "name": 1, "email": 1, 'mobile': 1, 'role': 1, 'avatar': 1, 'isActive': 1 } })
        const totalRecordsCount = await User.aggregate(aggregatePipeline)
        aggregatePipeline.push({ $skip: skip });
        aggregatePipeline.push({ $limit: limit });
        const getData = await User.aggregate(aggregatePipeline);
        return { statusCode: 200, status: 'success', message: 'Successfully getall data', data: getData || [], totalcount: totalRecordsCount.length || 0 }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }

}
export const approveByAdmin = async (reqbody) => {
    try {
        const user = await User.findOne({ _id: ObjectID(reqbody.userId) });
        if (!user) {
            return { statusCode: 400, status: 'error', message: 'No User Found' }
        }
        if ('isActive' in reqbody) {
            if (user.role.includes('SELLER')) {
                await Product.updateMany({ sellerId: reqbody.userId }, { $set: { isSellerActive: reqbody.isActive } }, { multi: true })
            }
        }
        if (reqbody.isActive === false) {
            const products = await Product.aggregate([
                { $match: { sellerId: ObjectID(reqbody.userId) } },
                { $addFields: { productId: { $toString: "$_id" } } },
                {
                    $lookup: {
                        from: 'carts',
                        localField: 'productId', foreignField: '_id',
                        as: 'cartDetails'
                    }
                },
               {
                    $project: { _id: 1 }
                }
            ])
            for (let product of products) {
                await Cart.deleteMany({ productId: product._id })
            }
        }
        const updateValues = { $set: { isActive: reqbody.isActive } };
        await User.updateOne({ _id: reqbody.userId }, updateValues);
        return { statusCode: 200, status: 'success', message: 'Successfully Changed User Status ' }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const createUser = async (reqbody) => {
    try {
        let user = await new User(reqbody);
        const hashpassword = reqbody.password ? await bcrypt.hash(reqbody.password, 5) : "";
        if (reqbody.mobile && await User.findOne({ mobile: reqbody.mobile })) {
            return { statusCode: 400, status: 'error', message: 'Mobile number already added' }
        }
        if (reqbody.email && await User.findOne({ email: reqbody.email })) {
            return { statusCode: 400, status: 'error', message: 'Email already added' }
        }
        user.password = hashpassword;
        await user.save()
        return { statusCode: 200, status: 'success', message: 'Successfully register ' }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const login = async (reqbody) => {
    try {
        let user = await User.findOne({ $or: [{ 'mobile': reqbody.name }, { 'email': reqbody.name }] });
        if (!user) {
            return { statusCode: 400, status: 'error', message: 'User not Register' }
        }
        if (user.isActive === false) {
            return { statusCode: 400, status: 'error', message: 'User is In-Active Status' }
        }
        if (!user || !(await bcrypt.compare(reqbody.password, user.password))) {
            return { statusCode: 400, status: 'error', message: 'Incorrect username or password' }
        }
        let userdetails = (user.role.includes('SELLER') || user.role.includes('ADMIN')) && await User.aggregate([{ $match: { $or: [{ mobile: reqbody.name }, { email: reqbody.name }] } }])
        const access_token = createAccessToken({ id: userdetails[0]._id })

        return { statusCode: 200, status: 'success', message: 'User logged in Successfully', data: userdetails[0], access_token: access_token }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }

}
export const logoutUser = async (reqbody) => {
    try {
        await Token.deleteOne({ token: reqbody.token });
        return { statusCode: 200, status: 'success', message: 'User logout in Successfully' }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
};