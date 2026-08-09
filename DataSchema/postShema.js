import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    post:{
        type: String,
        required: true
    },
    hastags:{
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