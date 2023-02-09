import connectDB from '../common/mongod';
import User from '../model/user'
import Product from '../model/product';
import RecentlyView from '../model/recentlyview'
import UserActivity from '../model/userActivity';
import Category from '../model/category'
import FavoriteProduct from '../model/favorite';
import {bulkProductsSchema} from '../validator/validation'
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const ObjectID = require('mongodb').ObjectId;

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
            let sortObjFinlal={};
            if (sort_obj.productname) {
                sortObjFinlal = { 'productname': sort_obj.productname }
                
            } else if (sort_obj.categoryname) {
                sortObjFinlal = { 'categoryname': sort_obj.categoryname }
            }
            else if (sort_obj.price) {
                sortObjFinlal = { 'price': sort_obj.price }
            }
            else if (sort_obj.quantity) {
                sortObjFinlal = { 'quantity': sort_obj.quantity }
            }
            sortObjFinlal._id = -1;
            aggregationPipeline.push({ $sort: sortObjFinlal })
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
export const updateSellertoProduct=async(reqbody)=>{
    try{
        const seller=await User.findOne({_id:ObjectID(reqbody.sellerId)})
        if(!seller){
            return { statusCode: 400, status: 'error', message: 'User not Found' }
        }
        const product=await Product.findOne({_id:ObjectID(reqbody.productId)})
        if(!product){
            return { statusCode: 400, status: 'error', message: 'Product not Found' }
        }
        await Product.updateOne({_id:ObjectID(reqbody.productId)},{sellerId:ObjectID(reqbody.sellerId)})
        return { statusCode: 200, status: 'success', message: 'Seller Name updated successfully' }
    }catch(error){
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
        let sortObjFinlal = {};
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
            if (sort_obj.productname) {
                sortObjFinlal = { 'productname': sort_obj.productname }

            } else if (sort_obj.categoryname) {
                sortObjFinlal = { 'categoryname': sort_obj.categoryname }
            }
            else if (sort_obj.price) {
                sortObjFinlal = { 'price': sort_obj.price }
            }
            else if (sort_obj.quantity) {
                sortObjFinlal = { 'quantity': sort_obj.quantity }
            }
            sortObjFinlal._id = -1;
            aggregatePipeline.push({ $sort: sortObjFinlal })
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
        console.log('reqbody', reqbody)
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
export const getbulkTemplate = async (reqbody) => {
    try {
        let colunmName = [];
        let column = ['PRODUCT', 'productname', 'description', 'images', 'price', 'quantity']
        const category = await Category.findOne({ '_id': ObjectID(reqbody?.categoryId) })
        colunmName.push(column)
        const workbook = XLSX.utils.book_new();
        const worksheet1 = XLSX.utils.json_to_sheet(colunmName, { skipHeader: true })
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'productTemplate')
        XLSX.utils.sheet_add_json(workbook.Sheets.productTemplate, [{ 'categoryname': category?.name }]), { skipHeader: true, origin: { r: 2, c: 3 } }
        let filepath = './assets/bulktemplate/bulk.xlsx'
        XLSX.writeFile(workbook, filepath)
        XLSX.readFile(filepath)
        const credpath = path.join(process.cwd(), '/assets/bulktemplate/bulk.xlsx')
        const productTemplate = fs.readFileSync(credpath)
        fs.unlink(filepath, err => { console.log('error', err) })
        return { statusCode: 200, status: 'success', message: 'Bulk upload templete created successfully', productTemplate }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const sellerProductBulkupload = async (body, files) => {
    try {
        const workbook = XLSX.readFile(files.file.filepath);
        const product_Lists = XLSX.utils.sheet_to_json(workbook.Sheets.productTemplate, { raw: true, header: 1, blankRows: false, defval: '' });
        if (product_Lists.length === 0) {
            return { statusCode: 400, status: 'error', message: 'Invalid template file' }
        }
        if (!body.sellerId) {
            return { statusCode: 400, status: 'error', message: 'choose seller' }
        }
        const user = await User.findOne({ _id: ObjectID(body.sellerId) })
        if (!user || !user?.role?.includes('SELLER')) {
            return { statusCode: 400, status: 'error', message: 'seller not found' }
        }
        let productlist = [];
        let negativeFieldname = [];
        const nagativeValue = (name) => {
            negativeFieldname.push(name)
        }
        let column = ['categoryname', 'productname', 'description', 'images', 'price', 'quantity']
        for (let i = 0; i < product_Lists.length - 1; i++) {
            if (product_Lists[i][0] !== '') {
                let k = 0;
                var productDetails = [];
                let obj = {};
                product_Lists[k].forEach((element, index) => {
                    if (column.includes(element)) {
                        obj[element] = product_Lists[i + 1][index]
                    } else {
                        nagativeValue(element)
                    }
                })
                productDetails.push(obj)
            }
            productlist.push(productDetails)
        }
        console.log('negativeFieldname', negativeFieldname)
        if (negativeFieldname.length !== 0) {
            let removed = negativeFieldname.pop();
            let fieldname = negativeFieldname.toString();
            if (negativeFieldname.length === 0) {
                fieldname = fieldname.concat(removed)
            } else {
                fieldname = fieldname.concat('and' + removed)
            }
            return { statusCode: 400, status: 'error', message: `please provide a valid for + ${fieldname}` }
        }
        let productNameList = '';
        const totalproduct = []
        for (let product of productlist) {
            const products = {};
            for (let i = 0; i < product.length; i++) {
                if (product[i]) {
                    if (product[i].productname === '' || product[i].description === '' || product[i].price === '' || product[i].quantity === '') {
                        return { statusCode: 400, status: 'error', message: `prduct details couldnt be empty ${product[i].productname}` }
                    }
                    let productname = product[i].productname || 'good'
                    if (productNameList.includes(productname) === true) {
                        return { statusCode: 400, status: 'error', message: `product name must be unique` }
                    }
                    products.productname = productname
                    if (productname) {
                        let product = await Product.findOne({ productname: productname, isProductDeleted: false })
                        if (product) {
                            return { statusCode: 400, status: 'error', message: `product already added`, data: { productname: product.productname } }

                        }
                    }
                    products.description = product[i].description;
                    products.sellerId = body.sellerId
                    products.images = (product[i].images.toString().split(',')) || []
                    products.price = product[i].price
                    products.quantity = product[i].quantity
                    const category = await Category.findOne({ name: { $regex: product[i].categoryname.toString().trim() } })
                    if (category) {
                        products.categoryId = category._id || ''
                        products.categoryname = category.name;
                    } else {
                        return { statusCode: 400, status: 'error', message: `Invalid product category` }
                    }
                    totalproduct.push(products)
                }
                const dataString=JSON.stringify(products)
                const parsedPrdocuts=JSON.parse(dataString);
                await bulkProductsSchema.validateAsync(parsedPrdocuts)
            }
        }
        await Promise.all(
            totalproduct.map(async (element) => {
                if (element) {
                    element.isBulkUpload = true;
                    let addproducts = Product(element)
                    await addproducts.save()
                }
            })
        )
        const productlistbulk = await Product.find({ sellerId: body.sellerId, isProductDeleted: false })
        return { statusCode: 200, status: 'success', message: 'Bulk upload templete added successfully', data: { productlist: productlistbulk, count: productlistbulk.length } }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
