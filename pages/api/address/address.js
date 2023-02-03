import connectDB from '../../../common/mongod'
import { addAddressSchema,deleteAddressSchema,updateAddressSchema} from '../../../validator/validation';
import { checkJwtToken } from '../../../common/constants'
import {createAddress,updateAddress,deleteAddress} from '../../../controller/address.controller'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST':{
            await addAddress(req,res);
            break;
        }
        case 'PUT':{
            await update(req,res);
            break;
        }
        case 'DELETE':{
            await removeAddress(req,res);
            break;
        }
    }
}

const addAddress=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await addAddressSchema.validateAsync(req.body);
            const cart = await createAddress(req.body);
            return res.status(cart.statusCode).send(cart)
        }
    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const update=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await updateAddressSchema.validateAsync(req.body);
            const cart = await updateAddress(req.body);
            return res.status(cart.statusCode).send(cart)
        }
    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const removeAddress=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await deleteAddressSchema.validateAsync(req.body);
            const cart = await deleteAddress(req.body);
            return res.status(cart.statusCode).send(cart)
        }
    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}