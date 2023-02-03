import Token from '../model/token'
import jwt from 'jsonwebtoken'
import User from '../model/user';


export const checkJwtToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ statuCode: 401, message: 'Login to access' });
    }
    if (authHeader) {
        const userTokenvalid = await Token.find({ token: authHeader })
        if (!userTokenvalid) {
            return res.status(401).send({ statuCode: 401, message: 'Login to access', data: { isLogout: true } });
        }
        const decode = jwt.verify(authHeader, 'claritaz@123')
        if (decode) {
            const user = await User.find({ _id: decode.id })
            return {userdetails:user}
        } else {
            return res.status(401).send({ statuCode: 401, message: 'Invalid Authentication', data: { isTokenExpired: true } });
        }
    } else {
        return res.status(401).send({ statuCode: 401, message: 'Invalid Request' });
    }

}

