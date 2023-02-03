import { createProduct, getProductsbySeller, getProductbyAdmin,updateProductSeller_Admin } from '../../../controller/product.controller'
import { addProductSchema, getProductSchemabySeller, getProductSchemabyAdmin ,updateProductSchema,updateAdminProductSchema} from '../../../validator/validation';
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST': {
            await addProduct(req, res);
            break;
        }
        case 'PATCH': {
            await getallProduct(req, res);
            break;
        }
        case 'PUT': {
            await updateProduct(req, res);
            break;
        }
    }
}
const getallProduct = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            if (result?.userdetails[0]?.role?.includes('ADMIN')) {
                await getProductSchemabyAdmin.validateAsync(req.body);
                const getdata = await getProductbyAdmin(req.body);
                return res.status(getdata.statusCode).send(getdata)
            }
            else if (result?.userdetails[0]?.role?.includes('SELLER')) {
                await getProductSchemabySeller.validateAsync(req.body);
                const getdata = await getProductsbySeller(req.body);
                return res.status(getdata.statusCode).send(getdata)
            }

        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const addProduct = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await addProductSchema.validateAsync(req.body);
            const getdata = await createProduct(req.body);
            return res.status(getdata.statusCode).send(getdata)
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            if(result?.userdetails[0]?.role?.includes('ADMIN')){
                await updateAdminProductSchema.validateAsync(req.body);
            }else{
                await updateProductSchema.validateAsync(req.body);
            }
            const getdata = await updateProductSeller_Admin(req.body,result);
            return res.status(getdata.statusCode).send(getdata)
        }

    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}