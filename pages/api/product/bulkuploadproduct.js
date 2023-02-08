import { sellerProductBulkupload } from '../../../controller/product.controller'
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'
const formidable = require('formidable')

connectDB();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    switch (req.method) {
        case 'POST': {
            await bulkuploadSellerProduct(req, res);
            break;
        }
    }
}

const bulkuploadSellerProduct = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            const form = new formidable.IncomingForm();
            try {
                await new Promise(function (resolve, reject) {
                    form.parse(req, async (err, fields, files) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        try {
                            const getdata = await sellerProductBulkupload(fields, files);
                            return res.status(getdata.statusCode).send(getdata)
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            } catch (err) {
                return res.status(500).json({ error: err });
            }
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
