import { User } from '../DataSchema/usersSchema.js';
// import { route } from 'loginRoutes/signup.js';

import express from 'express';
const Route = express.Router();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            message: 'Token Missing..'
        })
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    }   catch(err){
        return res.status(401).json({
            message: 'oops.. something went wrong'
        });
    }
}

//login Route
Route.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        // 'return' STOPS the function here.
        // Without it, the code below keeps running even after a response was sent.
        return res.status(400).json({
            message: 'You have to fill the fields'
        });
    }
    const user = await User.findOne({ email })
    if(!user){
        // 'return' is REQUIRED here: if there is no user, the next line
        // (user.password) would crash with "Cannot read properties of null".
        return res.status(404).json({
            message: 'User Not found'
        });
    }
    const compare = await bcrypt.compare(password, user.password);
    if(!compare){
        return res.status(401).json({
            message: 'Wrong Password'
        });
    }
    // jwt.sign(payload, secret, options) creates a signed token.
    // Previously res.status(200).json(...) was wrongly passed as a 4th argument
    // to jwt.sign AND 'token' was used before it existed (temporal dead zone).
    const token = jwt.sign({
        id: user._id, username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });

    return res.status(200).json({
        message: 'Login Success..', token
    });
})

export default Route;