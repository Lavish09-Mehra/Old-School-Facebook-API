import { User } from '../DataSchema/usersSchema.js';
// import { route } from 'loginRoutes/signup.js';

import express from 'express';
const Route = express.Router();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            message: 'Token Missing..'
        })
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // check the DB version against the one baked into the token so that
        // a token becomes invalid the moment the user logs out.
        const user = await User.findOne({ username: decoded.username });
        if(!user || user.tokenVersion !== decoded.tokenVersion){
            return res.status(401).json({
                message: 'Token is invalid or has been revoked..'
            });
        }
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
        id: user._id, username: user.username, tokenVersion: user.tokenVersion
    }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });

    return res.status(200).json({
        message: 'Login Success..', token
    });
})

//logout Route - bumps tokenVersion, revoking every token this user owns
Route.post('/logout', verifyToken, async(req, res) => {
    try{
        await User.updateOne(
            { username: req.user.username },
            { $inc: { tokenVersion: 1 } }
        );
        return res.status(200).json({
            message: 'Logged out Successfully..'
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. something went wrong'
        });
    }
})

export default Route;