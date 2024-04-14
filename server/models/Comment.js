import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
}, { timestamps: true })

export default mongoose.model('Comment', CommentSchema);