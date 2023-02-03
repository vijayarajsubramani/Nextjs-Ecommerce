import connectDB from '../../../common/mongod'
import { getAllAddressSchema,getbyIdAddressSchema} from '../../../validator/validation';
import { checkJwtToken } from '../../../common/constants'
import {getSellerAddress,getAddressbyId} from '../../../controller/address.controller'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST':{
            await getAllAddress(req,res);
            break;
        }
        case 'PATCH':{
            await getbyIdAddress(req,res);
            break;
        }
    }
}

const getAllAddress=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await getAllAddressSchema.validateAsync(req.body);
            const cart = await getSellerAddress(req.body);
            return res.status(cart.statusCode).send(cart)
        }
    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const getbyIdAddress=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await getbyIdAddressSchema.validateAsync(req.body);
            const cart = await getAddressbyId(req.body);
            return res.status(cart.statusCode).send(cart)
        }
    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
