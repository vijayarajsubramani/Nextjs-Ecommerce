import jwt from 'jsonwebtoken'
import connectDB from '../../../common/mongod'
import Users from '../../../model/user'
import { createAccessToken } from '../../../common/geneToeken'


connectDB()

export default async (req, res) => {
    try {
        const rf_token = req.headers.authorization;
        if (!rf_token) return res.status(400).json({ err: 'Please login now!' })

        const result = jwt.verify(rf_token, 'claritaz@123')
        if (!result) return res.status(400).json({ err: 'Your login session has expired. Please try again!' })

        const user = await Users.findById(result.id)
        if (!user) return res.status(400).json({ err: 'User does not exist.' })

        const access_token = createAccessToken({ id: user._id })
        return res.status(200).json({ access_token, user: user })
    } catch (err) {
        return res.status(500).json({ err: 'Sorry. Please Login Again or Contact Us!' })
    }
}

