import express from 'express';
const liked = express.Router();
import { Post } from '../DataSchema/postShema.js';

import { verifyToken } from '../loginRoutes/login.js';

liked.post('/post/:id/like', verifyToken, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message: 'Post not found..'
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