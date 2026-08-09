import express from 'express';
const pst = express.Router();

// '../DataSchema/...' -> the '../' moves UP one folder (out of src/),
// then into DataSchema. Keep the filename 'postShema.js' EXACTLY as on disk
// (it is misspelled on purpose - Node filenames are case-sensitive).
import { Post } from '../DataSchema/postShema.js';
import { verifyToken } from '../loginRoutes/login.js';
import { User } from '../DataSchema/usersSchema.js';

pst.post('/create-post', verifyToken, async(req, res) => {
    try{
    const { post, hastags, caption } = req.body;
    if(!post || !hastags || !caption){
        // 'return' stops here - otherwise the post below is saved anyway.
        return res.status(400).json({
            message: 'You have to fill all the fields..'
        });
    }
    const posts = new Post({
        username: req.user.username,
        post, 
        hastags,
        caption
    })
    const posting = await posts.save();
    return res.status(200).json({
        message: 'successfully created a Post..',
        posting
    })
    }   catch(err){
            res.status(500).json({
            message: 'oops..Something Went wrong'
        });
    }
});

pst.get('/feed', verifyToken, async (req, res) => {
    try{
        const feed = await Post.find();
        if(!feed.length){
            // 'return' is needed so the res.status(200) below doesn't also run
            // (sending two responses = "Cannot set headers after they are sent").
            return res.status(404).json({
                message: 'oops.. nothing To show..'
            });
        }
    return res.status(200).json({
        feed
    });
    }   catch(err){
        res.status(501).json({
        message: 'oops.. something went wrong'
        });
    }
});

pst.get('/post-of/:username', verifyToken, async(req, res) => {
    try{
    const usernames = req.params.username;
    const userprofile = await Post.find({
        username: usernames
    });
    return res.status(200).json(
        userprofile
    )
}   catch(err){
    res.status(500).json({
        message: 'oops.. Something Went Wrong',
        err
    })
}
});

pst.get('/me', verifyToken, async(req, res) => {
    try{
        const myprofile = await User.findOne({
            username: req.user.usename
        });
        const myposts = await Post.find({
            username: req.user.username
        });
        return res.json({myprofile, myposts});
    }   catch(err){
        res.status(404).json({
            message: 'No profile found..',
            err
        });
    }
});

export default pst;