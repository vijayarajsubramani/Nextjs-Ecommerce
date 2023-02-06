import connectDB from '../../../common/mongod'
import { orderVerifySchema} from '../../../validator/validation';
import { orderVerfiy} from '../../../controller/order.controller'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST':{
            await verfiyOrder(req,res);
            break;
        }
    }
}

const verfiyOrder=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await orderVerifySchema.validateAsync(req.body);
            const cart = await orderVerfiy(req.body);
            return res.status(cart.statusCode).send(cart)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}