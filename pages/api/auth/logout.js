import { logoutUser } from '../../../controller/auth.controller'
import { signOutSchema } from '../../../validator/validation';
import connectDB from '../../../common/mongod'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST": {
            await userLogout(req, res);
            break;
        }
    }
}
const userLogout = async (req, res) => {
    try {
        await signOutSchema.validateAsync(req.body);
        const logout = await logoutUser(req.body);
        return res.status(logout.statusCode).send(logout)
    } catch (error) {
        return res.status(500).send({ statusCode: 500, status: 'error', message: error.message });
    }
}