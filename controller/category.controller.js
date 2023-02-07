import connectDB from '../common/mongod';
import Category from '../model/category'
const ObjectId = require('mongodb').ObjectId;

connectDB();

export const getAllcateName=async(req)=>{
    try{
        let aggregatePipeline = [];
        aggregatePipeline.push({ $project: { "_id": 1, "name": 1 } })
        const getData = await Category.aggregate(aggregatePipeline);
        return { statusCode: 200, status: 'success', message: 'Successfully getall data',data:getData  }

    }catch(error){
        return { statusCode: 500, status: 'error', message: error.message };
    }

}
export const getCategory=async(reqbody)=>{
    try{
        let aggregatePipeline = [];
        const page = reqbody.page || 1;
        const limit = reqbody.limit || 10;
        const skip = (page - 1) * limit;
        aggregatePipeline.push({ $project: { "_id": 1, "name": 1 } })
        const totalRecordsCount = await Category.aggregate(aggregatePipeline)
        aggregatePipeline.push({ $skip: skip });
        aggregatePipeline.push({ $limit: limit });
        const getData = await Category.aggregate(aggregatePipeline);
        return { statusCode: 200, status: 'success', message: 'Successfully getall data',data:getData || [],totalcount: totalRecordsCount.length || 0 }

    }catch(error){
        return { statusCode: 500, status: 'error', message: error.message };
    }
}

export const addCategory = async (reqbody) => {
    try {
        const { name } = reqbody;
        const findcategory = await Category.findOne({ 'name': name });
        if (findcategory) {
            return { statusCode: 400, status: 'error', message: 'Category allready added ' }
        }
        let category = await new Category(reqbody);
        await category.save()
        return { statusCode: 200, status: 'success', message: 'Successfully added category ' }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const updateCategory = async (reqbody) => {
    try {
        const { categoryId, name } = reqbody;
        const findcategory = await Category.findOne({ 'name': name, '_id': { $ne: ObjectId(categoryId) } });
        if (findcategory) {
            return { statusCode: 400, status: 'error', message: 'Category allready added ' }
        }
        await Category.findOneAndUpdate({ _id: ObjectId(categoryId) }, { $set: { name: name } })
        return { statusCode: 200, status: 'success', message: 'Successfully updated category ' }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const deleteCategory = async (reqbody) => {
    try {
        const { categoryId} = reqbody;
        await Category.deleteOne({ _id: ObjectId(categoryId) })
        return { statusCode: 200, status: 'success', message: 'Successfully deleted category ' }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}