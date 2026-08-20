import express from 'express';
const liked = express.Router();
import mongoose from 'mongoose';
import { Post } from '../DataSchema/postShema.js';

import { verifyToken } from '../loginRoutes/login.js';

liked.post('/post/:id/like', verifyToken, async(req, res) => {
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(404).json({
                message: 'Post not found..'
            });
        }
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message: 'Post not found..'
            });
        }

        // prevent the same user from liking the post twice
        if(post.likes.includes(req.user.username)){
            return res.status(400).json({
                message: 'You already liked this post..'
            });
        }

        // push the logged-in user's username into the likes array
        post.likes.push(req.user.username);

        const likes = await post.save();
        return res.status(200).json({
            message: 'Post Liked..',
            likes
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});
export default liked;