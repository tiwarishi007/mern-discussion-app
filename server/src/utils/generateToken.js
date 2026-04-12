const jwt = require('jsonwebtoken');
const { key } = require('../config/env');

const generateToken = async (userId, res)=>{
    const token = jwt.sign({id:userId}, key, {expiresIn:'1d'});

    res.cookie('token', token, {
        httpOnly:true,
        maxAge: 3 * 24 * 60 * 60 * 1000
    })

    return token;
}

module.exports = generateToken;