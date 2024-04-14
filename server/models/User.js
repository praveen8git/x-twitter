import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    subscription: {
        type: String,
        default: () => {
            let myArray = ['Gold', 'Premium'] 
            return myArray[Math.round(Math.random() * myArray.length)]
        }
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    tweets: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        }]
    },
    retweets: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        }]
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        }]
    }
}, { timestamps: true })

export default mongoose.model('User', UserSchema);