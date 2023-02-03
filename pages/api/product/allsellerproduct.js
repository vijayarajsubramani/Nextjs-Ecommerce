import connectDB from '../../../common/mongod'
import { getAllProduct} from '../../../controller/product.controller'
import {  getAllProductSchema } from '../../../validator/validation';



connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST': {
            await getAllProductbyseller(req, res);
            break;
        }
    }
}


const getAllProductbyseller = async (req, res) => {
    console.log('reqbody',req.body)
    try {
        await getAllProductSchema.validateAsync(req.body);
        const getdata = await getAllProduct(req.body);
        return res.status(getdata.statusCode).send(getdata)

    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}