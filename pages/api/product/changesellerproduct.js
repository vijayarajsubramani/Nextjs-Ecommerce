import {  updateSellertoProduct} from '../../../controller/product.controller'
import { updateSellerIdToProductSchema} from '../../../validator/validation';
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'PUT': {
            await updateSellerIdToProduct(req, res);
            break;
        }
    }
}
const updateSellerIdToProduct = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            if (result?.userdetails[0]?.role?.includes('ADMIN')) {
                await updateSellerIdToProductSchema.validateAsync(req.body);
                const getdata = await updateSellertoProduct(req.body);
                return res.status(getdata.statusCode).send(getdata)
            }
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}