import { getallUser,approveByAdmin } from '../../../controller/auth.controller'
import { getallUserSchema,activeByAdmin} from '../../../validator/validation';
import connectDB from '../../../common/mongod'

import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case 'POST':{
            await getallData(req,res);
            break;
        }
        case 'PUT':{
            await sellerApproveByAdmin(req,res);
            break;
        }
    }
}
const getallData=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await getallUserSchema.validateAsync(req.body);
            const getdata = await getallUser(req.body);
            return res.status(getdata.statusCode).send(getdata)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });

    }
}
const sellerApproveByAdmin=async(req,res)=>{
    try{
        const result = await checkJwtToken(req, res)
        if (!result) {
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        } else {
            await activeByAdmin.validateAsync(req.body);
            const getdata = await approveByAdmin(req.body);
            return res.status(getdata.statusCode).send(getdata)
        }

    }catch(error){
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });

    }
}
