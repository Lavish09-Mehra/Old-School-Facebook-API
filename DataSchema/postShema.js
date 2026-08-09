import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    username: {    //username for the post so can see the post by username
        type: String,
        required: true
    },
    post:{
        type: String,
        required: true
    },
    hastags:{    //can insert multiple hashtags and mistake is typo of hashtag if you are copying just correct 
        type: [String],
        required: true
    },
    caption:{
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    comments: [
        {
            username: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
