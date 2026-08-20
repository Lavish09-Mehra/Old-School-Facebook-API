import express from 'express';
const follow = express.Router();
import { User } from '../DataSchema/usersSchema.js';
import { verifyToken } from '../loginRoutes/login.js';

// ---- FOLLOW ----
follow.post('/follow/:username', verifyToken, async(req, res) => {
    try{
        const { username } = req.params;
        if(username === req.user.username){
            return res.status(400).json({
                message: 'You cannot follow yourself..'
            });
        }

        const target = await User.findOne({ username });
        if(!target){
            return res.status(404).json({
                message: 'User not found..'
            });
        }

        if(target.followers.includes(req.user.username)){
            return res.status(400).json({
                message: 'You already follow this user..'
            });
        }

        await User.updateOne(
            { username: req.user.username },
            { $addToSet: { following: username } }
        );
        await User.updateOne(
            { username },
            { $addToSet: { followers: req.user.username } }
        );

        return res.status(200).json({
            message: `You are now following ${username}..`,
            follow: { user: username }
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});

// ---- UNFOLLOW ----
follow.delete('/follow/:username', verifyToken, async(req, res) => {
    try{
        const { username } = req.params;
        if(username === req.user.username){
            return res.status(400).json({
                message: 'You cannot unfollow yourself..'
            });
        }

        const target = await User.findOne({ username });
        if(!target){
            return res.status(404).json({
                message: 'User not found..'
            });
        }

        if(!target.followers.includes(req.user.username)){
            return res.status(400).json({
                message: 'You do not follow this user..'
            });
        }

        await User.updateOne(
            { username: req.user.username },
            { $pull: { following: username } }
        );
        await User.updateOne(
            { username },
            { $pull: { followers: req.user.username } }
        );

        return res.status(200).json({
            message: `You unfollowed ${username}..`
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});

// ---- WHO I FOLLOW ----
follow.get('/following', verifyToken, async(req, res) => {
    try{
        const { following } = await User.findOne({ username: req.user.username });
        return res.status(200).json({
            following
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});

// ---- MY FOLLOWERS ----
follow.get('/followers', verifyToken, async(req, res) => {
    try{
        const { followers } = await User.findOne({ username: req.user.username });
        return res.status(200).json({
            followers
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});

// ---- ANY USER PROFILE ----
follow.get('/user/:username', verifyToken, async(req, res) => {
    try{
        const { username } = req.params;
        const profile = await User.findOne({ username }).select('username followers following createdAt');
        if(!profile){
            return res.status(404).json({
                message: 'User not found..'
            });
        }
        return res.status(200).json({
            profile
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});

export default follow;