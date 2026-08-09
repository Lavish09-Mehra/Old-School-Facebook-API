import express from 'express';
const Forgot = express.Router();

import { User } from '../DataSchema/usersSchema.js';
import { verifyToken } from './login.js';

import bcrypt from 'bcrypt';

Forgot.put('/forgot-password', verifyToken ,async(req, res) => {
    try{
    const { username, email, newpassword } = req.body
    if(!username || !email || !newpassword){
        return res.status(404).json({
            message: 'All the fields are important to fill..'
        });
    }
    const profile = await User.findOne({ username, email });
    if(!profile){
        return res.status(404).json({
            message: 'user not found..'
        })
    }
    const hashedpassword = await bcrypt.hash(newpassword, 12);
    profile.password = hashedpassword; //user.password replace it by profile.password
    await profile.save();
    res.status(201).json({
        message: 'successfully created..',
        profile
    })
}   catch(err){
    return res.status(500).json({
        message: 'oops.. something went wrong..'
    })
}
});

export default Forgot;