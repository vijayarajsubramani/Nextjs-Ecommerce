import { addCategory, updateCategory,getCategory,deleteCategory,getAllcateName } from '../../../controller/category.controller'
import { createCategorySchema, updateCategorySchema,getCategorySchema ,deleteCategorySchema} from '../../../validator/validation';
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'PATCH':{
            await getallData(req,res);
            break;
        }
        case "POST": {
            await createCategory(req, res);
            break;
        }
        case 'PUT': {
            await editCategory(req, res)
            break;
        }
        case 'DELETE':{
            await removeCategory(req,res)
            break;
        }
        case 'GET':{
            await getallCategoryName(req,res)
            break;
        }
    }
}
const getallCategoryName=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            const getdata = await getAllcateName(req.body);
            return res.status(getdata.statusCode).send(getdata)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });

    }
}
const getallData=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await getCategorySchema.validateAsync(req.body);
            const getdata = await getCategory(req.body);
            return res.status(getdata.statusCode).send(getdata)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });

    }
}

const createCategory = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            if(result?.userdetails[0]?.role==='ADMIN'){
                await createCategorySchema.validateAsync(req.body);
                const addcategory = await addCategory(req.body);
                return res.status(addcategory.statusCode).send(addcategory)
            }else{
                return res.status(400).json({ statusCode: 400, status: 'error', message: 'Category access only by admin' })
            }
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const editCategory = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            if(result?.userdetails[0]?.role==='ADMIN'){
                await updateCategorySchema.validateAsync(req.body);
                const updatecategory = await updateCategory(req.body);
                return res.status(updatecategory.statusCode).send(updatecategory)
            }else{
                return res.status(400).json({ statusCode: 400, status: 'error', message: 'Category access only by admin' })
            }  
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const removeCategory = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            if(result?.userdetails[0]?.role==='ADMIN'){
                await deleteCategorySchema.validateAsync(req.body);
                const updatecategory = await deleteCategory(req.body);
                return res.status(updatecategory.statusCode).send(updatecategory)
            }else{
                return res.status(400).json({ statusCode: 400, status: 'error', message: 'Category access only by admin' })
            }  
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}