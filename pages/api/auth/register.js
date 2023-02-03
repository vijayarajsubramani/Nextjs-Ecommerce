import {createUser} from '../../../controller/auth.controller'
import { registerSchema } from '../../../validator/validation';
import connectDB from '../../../common/mongod'
connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST": {
            await register(req, res);
            break;
        }
    }
}
const register = async (req, res) => {
    try {
        await registerSchema.validateAsync(req.body);
        const user = await createUser(req.body);
        return res.status(user.statusCode).send(user)
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}