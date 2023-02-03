import { approveProductByadmin, getSingleProduct ,getAllProduct} from '../../../controller/product.controller'
import {  getAllProductSchema } from '../../../validator/validation';
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'GET': {
            await getProductById(req, res);
            break;
        }
        case 'PUT': {
            await approveProduct(req, res);
            break;
        }
        case 'POST': {
            await getAllProductbyseller(req, res);
            break;
        }
    }
}

const getProductById = async (req, res) => {
    try {
        const getdata = await getSingleProduct(req.query);
        return res.status(getdata.statusCode).send(getdata)
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const approveProduct = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            // await approveProductSchema.validateAsync(req.query);
            const approve = await approveProductByadmin(req.query, req.body);
            return res.status(approve.statusCode).send(approve)
        }

    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const getAllProductbyseller = async (req, res) => {
    try {
        await getAllProductSchema.validateAsync(req.body);
        const getdata = await getAllProduct(req.body,req.query);
        return res.status(getdata.statusCode).send(getdata)

    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
