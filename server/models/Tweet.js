import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
    tweetBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // unique: true
        }]
    },
    retweets: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
    },
    retweetedThis: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        }]
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
    },
}, { timestamps: true });

export default mongoose.model('Tweet', TweetSchema);