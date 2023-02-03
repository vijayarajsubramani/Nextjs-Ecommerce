import jwt from 'jsonwebtoken'

export const createAccessToken = (payload) => {
    return jwt.sign(payload, 'claritaz@123', {expiresIn: '1d'})

}
