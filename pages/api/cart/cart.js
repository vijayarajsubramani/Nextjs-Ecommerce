import connectDB from '../../../common/mongod'
import { addtoCartSchema,getAllCartSchema,deleteCartSchema} from '../../../validator/validation';
import { addtoCart,getAllcart,deleteCart } from '../../../controller/cart.controller'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST':{
            await addToCart(req,res);
            break;
        }
        case 'PATCH':{
            await getAllCarts(req,res);
            break;
        }
        case 'DELETE':{
            await removeCart(req,res);
            break;
        }
    }
}

const addToCart=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await addtoCartSchema.validateAsync(req.body);
            const cart = await addtoCart(req.body);
            return res.status(cart.statusCode).send(cart)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const getAllCarts=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await getAllCartSchema.validateAsync(req.body);
            const cart = await getAllcart(req.body);
            return res.status(cart.statusCode).send(cart)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const removeCart=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await deleteCartSchema.validateAsync(req.body);
            const cart = await deleteCart(req.body);
            return res.status(cart.statusCode).send(cart)
        }
    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });

    }
}
