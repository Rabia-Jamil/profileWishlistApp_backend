const jwt = require('jsonwebtoken')
const Profile = require('../models/profile')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '') //replace replaces the 1st string with the 2nd one
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET) //it will give the actual id(jis ko hum ne token bnaya tha)
        const profile = await Profile.findOne({ _id: decoded_token._id, 'tokens.token': token }) //we use findOne when we have to use multiple things. The second parameter "token" will check whether the user is logged in or not
        if(!profile){
            throw new Error()
        }
        req.token = token //when we write req.token we'll get that the user is logged in with this token
        req.profile = profile //when we we'll write req.profile we'll get that particular record of the user who is logged in
        next()   
    }
    catch(e){
        res.status(401).send({ error: 'Please login first!'})
    }
}

module.exports = auth