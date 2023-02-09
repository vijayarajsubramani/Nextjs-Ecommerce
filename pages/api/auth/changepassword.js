import { passwordChange } from '../../../controller/auth.controller'
import { changePasswordSchema } from '../../../validator/validation';
import connectDB from '../../../common/mongod'
import { checkJwtToken } from '../../../common/constants'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST": {
            await changePassword(req, res);
            break;
        }
    }
}
const changePassword = async (req, res) => {
    try {
        const result = await checkJwtToken(req, res)
        if(!result){
            return res.status(400).json({ statusCode: 400, status: 'error', message: 'Authentication is not valid.' })
        }else{
            await changePasswordSchema.validateAsync(req.body);
            const user = await passwordChange(req.body);
            return res.status(user.statusCode).send(user)
        }
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}
