import connectDB from '../common/mongod';
import User from '../model/user'
const ObjectID = require('mongodb').ObjectId;
import Product from '../model/product';
import RecentlyView from '../model/recentlyview'
import UserActivity from '../model/userActivity';
import Category from '../model/category'
import FavoriteProduct from '../model/favorite';
connectDB();


export const getProductsbySeller = async (reqbody) => {
    try {
        let filter_obj = reqbody.filterObj;
        let sort_obj = reqbody.sortObj;
        const page = reqbody.page || 1;
        const limit = reqbody.limit || 10;
        const skip = (page - 1) * limit;
        let aggregationPipeline = [];
        aggregationPipeline.push(
            {
                $addFields: {
                    sellerObjId: { $toObjectId: "$sellerId" },
                    categoryObjId: { $toObjectId: "$categoryId" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sellerObjId',
                    foreignField: '_id',
                    pipeline: [{ $project: { name: 1, email: 1, mobile: 1 } }],
                    as: 'sellerDetails'
                }
            },
            { $unwind: "$sellerDetails" },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryObjId',
                    foreignField: '_id',
                    pipeline: [{ $project: { name: 1 } }],
                    as: 'categoryDetails'
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    sellerObjId: 0,
                    categoryObjId: 0,
                    __v: 0

                }
            },
            { $match: { $and: [{ sellerId: ObjectID(reqbody.sellerId) }, { isProductDeleted: false }] } },

        );
        if (filter_obj.productname) {
            filter_obj.productname = { $regex: filter_obj.productname, $options: 'i' }
        }
        if (filter_obj.productStatus) {
            filter_obj.productStatus = { $regex: filter_obj.productStatus, $options: 'i' }
        }
        if (filter_obj.sellerName) {
            filter_obj.sellerName = { $regex: filter_obj.sellerName, $options: "i" }
        }
        if (filter_obj.categoryName) {
            filter_obj.categoryName = { $regex: filter_obj.categoryName, $options: "i" }
        }
        if (Object.entries(filter_obj).length !== 0) {
            const filter = { $match: filter_obj }
            aggregationPipeline.push(filter)
        }
        if (sort_obj) {
            const sort_app = { $sort: sort_obj }
            aggregationPipeline.push(sort_app)
        }
        const totalProductCount = await Product.aggregate(aggregationPipeline);
        aggregationPipeline.push({ $skip: skip });
        aggregationPipeline.push({ $limit: limit });
        const product = await Product.aggregate(aggregationPipeline).collation({ 'locale': 'en' })
        return { statusCode: 200, status: 'success', message: 'Successfully getall data', data: product || [], totalcount: totalProductCount.length || 0 }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }

}
export const getProductbyAdmin = async (reqbody) => {
    try {
        let filter_obj = reqbody.filterObj;
        let sort_obj = reqbody.sortObj;
        const page = reqbody.page || 1;
        const limit = reqbody.limit || 10;
        const skip = (page - 1) * limit;
        let aggregatePipeline = [];

        aggregatePipeline.push(
            {
                $addFields: {
                    sellerObjId: {
                        $toObjectId: '$sellerId'
                    },
                    categoryObjId: {
                        $toObjectId: '$categoryId'
                    }
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'sellerObjId',
                    foreignField: '_id',
                    pipeline: [{
                        $project: { name: 1, email: 1, mobile: 1 }
                    }],
                    as: 'sellerDetails'
                }
            },
            { $unwind: '$sellerDetails' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryObjId',
                    foreignField: '_id',
                    pipeline: [{
                        $project: { name: 1 }
                    }],
                    as: 'categoryDetails'
                }
            },
            { $unwind: '$categoryDetails' },
            {
                $project: {
                    sellerObjId: 0, categoryObjId: 0, __v: 0
                }
            },
            {
                $addFields: {
                    sellerName: '$sellerDetails.name',
                    categoryName: '$categoryDetails.name'
                }
            },
            { $match: { isProductDeleted: false } }
        );
        if (filter_obj?.productname) {
            filter_obj.productname = { $regex: filter_obj.productname, $options: 'i' }
        }
        if (filter_obj?.productStatus) {
            filter_obj.productStatus = { $regex: filter_obj.productStatus, $options: 'i' }
        }
        if (filter_obj?.sellerName) {
            filter_obj.sellerName = { $regex: filter_obj.sellerName, $options: "i" }
        }
        if (filter_obj?.categoryName) {
            filter_obj.categoryName = { $regex: filter_obj.categoryName, $options: "i" }
        }
        if (Object.entries(filter_obj).length !== 0) {
            const filter = { $match: filter_obj }
            aggregatePipeline.push(filter)
        }
        if (sort_obj) {
            const sort_app = { $sort: sort_obj }
            aggregatePipeline.push(sort_app)
        }
        const totalProductCount = await Product.aggregate(aggregatePipeline);
        aggregatePipeline.push({ $skip: skip });
        aggregatePipeline.push({ $limit: limit });
        const product = await Product.aggregate(aggregatePipeline).collation({ 'locale': 'en' })
        return { statusCode: 200, status: 'success', message: 'Successfully getall data', data: product || [], totalcount: totalProductCount.length || 0 }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }

}
const userActivityRecently = async (details, activityTypes, types) => {
    try {
        const activity = {
            userId: details.sellerId,
            activityTypes: activityTypes,
            sellerId: details.sellerId,
            typeId: details.typeId
        }
        if (types === 'PRODUCT') {
            let productDetail = {
                buyerId: details.sellerId,
                productId: details.typeId,
                productSellerId: details.sellerId
            }
            let viewProduct = new RecentlyView(productDetail);
            await viewProduct.save();
            if (details.userId) {
                let user = new UserActivity(activity)
                await user.save()
            }
        }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const getAllProduct = async (reqbody, query) => {
    try {
        let filter_obj = reqbody.filterObj;
        let sort_obj = reqbody.sortObj;
        const page = reqbody.page || 1;
        const limit = reqbody.limit || 10;
        const skip = (page - 1) * limit;
        let aggregationPipeline = [];
        let filterArr = [];
        let searchArr = [];
        let sortObjFinlal = {};
        let primaryFilterObj = reqbody.primaryFilterObj;

        filterArr.push({ productStatus: "APPROVED" });
        filterArr.push({ isProductDeleted: false })
        filterArr.push({ isSellerActive: true })

        if (primaryFilterObj && primaryFilterObj?.primaryFilterName === 'SELLER_PRODUCT') {
            filterArr.push({ $and: [{ sellerId: ObjectID(reqbody.sellerId) }, { _id: { $ne: ObjectID(query.id) } }] })
        }
        if (primaryFilterObj && primaryFilterObj?.primaryFilterName === 'RECENT') {
            if (!reqbody.sellerId) {
                return { statusCode: 400, status: 'error', message: 'Provide a buyerId' }
            }
            let prodArrayIds;
            if (primaryFilterObj?.primaryFilterName === 'RECENTLY') {
                prodArrayIds = await RecentlyView.distinct('productId', { buyerId: reqbody.sellerId })
            } else {
                return { statusCode: 400, status: 'error', message: 'Provide a valid primaryFilterName' }
            }
            if (!prodArrayIds || !prodArrayIds.length) {
                return { statusCode: 200, status: 'success', message: 'Product fetched Successfully', data: [] }
            }
            const prodIdArray = prodArrayIds.map((x) => { return ObjectID(x) })
            filterArr.push({ '_id': { $in: prodIdArray } })
        }
        if (primaryFilterObj && primaryFilterObj.primaryFilterName === 'FAVORITE') {
            if (!reqbody.sellerId) {
                return { statusCode: 400, status: 'error', message: 'Provide a sellerId' }
            }
            const favorite = await FavoriteProduct.distinct('productId', { sellerId: reqbody.sellerId });
            const favArr = favorite.map((x) => { return ObjectID(x) })
            filterArr.push({ '_id': { $in: favArr } })
        }
        if (filter_obj) {
            if (filter_obj.categoryName) {
                filterArr.push({ $or: [{ 'categoryname': filter_obj.categoryName }] })
            }
            if (filter_obj.minPrice) {
                filterArr.push({ 'price': { $gte: parseInt(filter_obj.minPrice) } })
            }
            if (filter_obj.maxPrice) {
                filterArr.push({ 'price': { $lte: parseInt(filter_obj.maxPrice) } })
            }
        }
        if (sort_obj) {
            if (sort_obj === 'createdAt-DESC') {
                sortObjFinlal = { 'createdAt': -1, _id: 1 }
            }
            if (sort_obj === 'price-ASC') {
                sortObjFinlal = { 'price': 1, _id: 1 }
            }
        }
        if (reqbody.searchValue) {
            searchArr.push({ productname: { $regex: reqbody.searchValue, $options: 'i' } }, { categoryname: { $regex: reqbody.searchValue, $options: 'i' } })
        }
        let filterArray = ['RECENTLY']
        aggregationPipeline.push({ $match: { $and: filterArr } })
        aggregationPipeline.push({ $sort: sortObjFinlal })
        searchArr.length && aggregationPipeline.push({ $match: { $or: searchArr } })
        let totalProductCount = 0;
        totalProductCount = await Product.aggregate(aggregationPipeline);
        const products = await Product.aggregate(aggregationPipeline).skip(skip).limit(limit);
        if (reqbody.sellerId) {
            if (!filterArray.includes(primaryFilterObj?.primaryFilterName)) {
                products.map(async (x) => {
                    const productDetails = {
                        typeId: String(x._id),
                        sellerId: x.sellerId
                    }
                    await userActivityRecently(productDetails, 'VISIT', 'PRODUCT')
                })
            }
        }
        return { statusCode: 200, status: 'success', message: 'Successfully getall data', data: products || [], totalcount: totalProductCount.length || 0 }


    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const createProduct = async (reqbody) => {
    try {
        const userdetails = await User.findOne({ $and: [{ _id: ObjectID(reqbody.sellerId) }, { isActive: true }] });
        if (!userdetails) {
            return { statusCode: 400, status: 'error', message: 'Seller is not Active' }
        }
        const product = await Product.findOne({ 'productname': reqbody.productname.trim() });
        if (product) {
            return { statusCode: 400, status: 'error', message: 'Product Already added' }
        }
        const category = await Category.findOne({ _id: ObjectID(reqbody.categoryId) });
        reqbody.categoryname = category.name || "";
        const addProduct = new Product(reqbody);
        await addProduct.save();
        return { statusCode: 200, status: 'success', message: 'Successfully added product ' }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const getSingleProduct = async (reqbody) => {
    try {
        const product = await Product.aggregate([
            { $match: { _id: ObjectID(reqbody.id) } },
            {
                $addFields: {
                    sellerObjId: { $toObjectId: '$sellerId' },
                    categoryObjId: { $toObjectId: '$categoryId' }
                }
            },
            {
                $lookup: {
                    from: 'users', localField: 'sellerObjId', foreignField: '_id',
                    pipeline: [{
                        $project: { name: 1, email: 1, mobile: 1 }
                    }],
                    as: 'sellerDetails'
                }
            },
            { $unwind: '$sellerDetails' },
            {
                $lookup: {
                    from: 'categories', localField: 'categoryObjId', foreignField: '_id',
                    pipeline: [{
                        $project: { name: 1 }
                    }],
                    as: 'categoyDetails'
                }
            },
            {
                $project: {
                    sellerObjId: 0, categoryObjId: 0, __v: 0
                }
            },
        ]);
        if (product.length) {
            return { statusCode: 200, status: 'success', message: 'Successfully fetched product ', data: product }
        }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const approveProductByadmin = async (reqquery, reqbody) => {
    try {
        const product = await Product.findOne({ _id: reqquery.id });
        if (!product) {
            return { statusCode: 400, status: 'error', message: 'No Product Found' }
        }
        const updateValues = { $set: { productStatus: reqbody.productStatus } };
        await Product.updateOne({ _id: reqquery.id }, updateValues);
        return { statusCode: 200, status: 'success', message: 'Successfully Changed Product Status ' }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const updateProductSeller_Admin = async (reqbody, result) => {
    try {
        if (result?.userdetails[0]?.role?.includes('SELLER')) {
            const user = await User.findOne({ $and: [{ _id: ObjectID(reqbody.sellerId) }, { isActive: true }] });
            if (!user) {
                return { statusCode: 400, status: 'error', message: 'User Not allowed to update product' }
            }
        }
        let product;
        if (result?.userdetails[0]?.role?.includes('ADMIN')) {
            product = await Product.findOne({ _id: ObjectID(reqbody.productId) })
        } else {
            product = await Product.findOne({ sellerId: ObjectID(reqbody.sellerId), _id: ObjectID(reqbody.productId) })
        }
        if (!product) {
            return { statusCode: 400, status: 'error', message: 'No product Found' }
        }
        if (!result?.userdetails[0]?.role?.includes('ADMIN') && product.productStatus !== 'APPROVED') {
            return { statusCode: 400, status: 'error', message: 'Product Not Yet Approved' }
        }
        if (!result?.userdetails[0]?.role?.includes('ADMIN')) {
            reqbody.productStatus = 'PENDING'
        }
        if (reqbody.productname) {
            const productCheck = await Product.findOne({ productname: reqbody.productname.trim(), _id: { $ne: ObjectID(reqbody.productId) }, isProductDeleted: false })
            if (productCheck) {
                return { statusCode: 400, status: 'error', message: 'Product Name already added' }
            }
        }
        if (reqbody.categoryId) {
            const categoryname = await Category.findOne({ _id: ObjectID(reqbody.categoryId) })
            reqbody.categoryname = categoryname.name || ""
        }
        let details;
        if (result?.userdetails[0]?.role?.includes('ADMIN')) {
            details = await Product.findOneAndUpdate({ _id: reqbody.productId }, reqbody)
            return { statusCode: 200, status: 'success', message: 'Successfully updated product ' }
        } else {
            details = await Product.findOneAndUpdate({ sellerId: reqbody.sellerId, _id: reqbody.productId }, reqbody)
            return { statusCode: 200, status: 'success', message: 'Successfully updated product ' }
        }

    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const addToFavProduct = async (reqbody) => {
    try {
        const favorite = await FavoriteProduct.findOne({ sellerId: reqbody.sellerId, productId: reqbody.productId });
        if (favorite) {
            return { statusCode: 400, status: 'error', message: 'Product already added into favorites' }
        }
        console.log('reqbody',reqbody)
        let addToFav = new FavoriteProduct(reqbody);
        await addToFav.save();
        const product = await Product.findOne({ _id: ObjectID(reqbody.productId) })
        if (product) {
            const favCount = product?.favoritesCount ? product?.favoritesCount + 1 : 1;
            await Product.updateOne({ _id: ObjectID(reqbody.productId) }, { favoritesCount: favCount })
            const activity = {
                userId: reqbody.sellerId,
                activityType: 'FAVORITE',
                typeId: reqbody.productId,
                sellerId: product?.sellerId
            }
            let userAct = UserActivity(activity);
            await userAct.save()
            return { statusCode: 200, status: 'success', message: 'Product successfully added into favorites ' }

        }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };

    }
}
export const removeFavProduct = async (reqbody) => {
    try {
        const favorite = await FavoriteProduct.findOne({ sellerId: reqbody.sellerId, productId: reqbody.productId });
        if (!favorite) {
            return { statusCode: 400, status: 'error', message: 'Product not found in favorite' }
        }
        await FavoriteProduct.deleteOne({ sellerId: reqbody.sellerId, productId: reqbody.productId })
        await UserActivity.deleteOne({ userId: reqbody.userId, typeId: reqbody.productId });
        const product = await Product.findOne({ _id: ObjectID(reqbody.productId) })
        if (product) {
            const favCount = product?.favoritesCount ? +(product?.favoritesCount) - 1 : 0;
            await Product.updateOne({ _id: ObjectID(reqbody.productId) }, { favoritesCount: favCount })
        }

        return { statusCode: 200, status: 'success', message: 'Product successfully removed from favorites ' }


    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
