import connectDB from '../../../common/mongod'
import { addtoFovoriteSchema} from '../../../validator/validation';
import { addToFavProduct ,removeFavProduct} from '../../../controller/product.controller'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST':{
            await addToFavorite(req,res);
            break;
        }
        case 'PUT':{
            await removeToFavorite(req,res);
            break;
        }
    }
}

const addToFavorite=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await addtoFovoriteSchema.validateAsync(req.body);
            const cart = await addToFavProduct(req.body);
            return res.status(cart.statusCode).send(cart)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
const removeToFavorite=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await addtoFovoriteSchema.validateAsync(req.body);
            const cart = await removeFavProduct(req.body);
            return res.status(cart.statusCode).send(cart)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}