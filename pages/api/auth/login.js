import { login } from '../../../controller/auth.controller'
import { loginSchema } from '../../../validator/validation';
import Token from '../../../model/token';
import connectDB from '../../../common/mongod'
import jwt from 'jsonwebtoken'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST": {
            await loginuser(req, res);
            break;
        }
    }
}
const loginuser = async (req, res) => {
    try {
        await loginSchema.validateAsync(req.body);
        const user = await login(req.body);
        return res.status(user.statusCode).send(user)
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}