import {  getbulkTemplate ,sellerProductBulkupload} from '../../../controller/product.controller'
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST': {
            await getbulkUploadTemplate(req, res);
            break;
        }
        case 'PATCH':{
            await bulkuploadSellerProduct(req, res);
            break;
        }
    }
}
const getbulkUploadTemplate = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
                const getdata = await getbulkTemplate(req.body);
                return res.status(getdata.statusCode).send(getdata)
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const bulkuploadSellerProduct=async(req,res)=>{
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
                const getdata = await sellerProductBulkupload(req);
                return res.status(getdata.statusCode).send(getdata)
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}