import { User } from '../DataSchema/usersSchema.js';
import express from 'express';
const route = express.Router();

// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//signup 
route.post('/signup', async(req, res) => {
    try{
    const { username, email, password } = req.body
    if(!username || !email || !password){
        // 'return' stops here so we don't continue creating the account
        // even though the required fields are missing.
        return res.status(400).json({
            message: 'All the fields are Must'
        });
    }
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const userdetails = new User({
        username,
        email,
        password: hashedPass
    })
    const result = await userdetails.save();
    const { password: _password, ...safeUser } = result.toObject();
    return res.status(201).json({
        message: 'Succesfully Created a account On Old-School Facebook API..',
        user: safeUser
    })
    }
    catch(err){
        res.status(500).json({
            message: 'oops.. Something went wrong',
            err
        })
    }
});

export default route;