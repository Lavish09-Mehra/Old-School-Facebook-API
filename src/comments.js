import express from 'express';
const cmnt = express.Router();
import { verifyToken } from '../loginRoutes/login.js';

import { Post } from '../DataSchema/postShema.js';

// ---- COMMENTS ----
cmnt.post('/post/:id/comment', verifyToken, async(req, res) => {
    try{
        const { text } = req.body;
        if(!text){
            return res.status(400).json({
                message: 'Comment text is required..'
            });
        }

        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message: 'Post not found..'
            });
        }

        // username comes from the JWT, NEVER from the frontend
        post.comments.push({
            username: req.user.username,
            text
        });

        const commented = await post.save();
        return res.status(201).json({
            message: 'Comment added..',
            commented
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});

// ---- DELETE COMMENT ----
cmnt.delete('/post/:id/comment/:commentId', verifyToken, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message: 'Post not found..'
            });
        }

        const comment = post.comments.id(req.params.commentId);
        if(!comment){
            return res.status(404).json({
                message: 'Comment not found..'
            });
        }

        // only the author of the comment can delete it (username from the JWT)
        if(comment.username !== req.user.username){
            return res.status(403).json({
                message: 'You can only delete your own comments..'
            });
        }

        comment.deleteOne();
        const updated = await post.save();
        return res.status(200).json({
            message: 'Comment deleted..',
            updated
        });
    }   catch(err){
        return res.status(500).json({
            message: 'oops.. Something Went Wrong'
        });
    }
});
export default cmnt;