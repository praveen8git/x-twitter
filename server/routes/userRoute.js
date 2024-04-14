import express from 'express';
import auth from '../middlewares/auth.js';
import { deleteTweetById, getAllTweets, getTweetById, likeTweet, postRetweet, postTweet } from '../controllers/tweetController.js';
import { getUserProfile, getFollowersListByUsername, getFollowingListByUsername, updateUserById, toggleFollowByUsername } from '../controllers/userController.js';
import { postComment, deleteComment } from '../controllers/commentController.js';

const userRouter = express.Router();

userRouter.get('/tweet/:tweetId', auth, getTweetById);
userRouter.get('/all-tweets', auth, getAllTweets);
userRouter.post('/tweet', auth, postTweet);
userRouter.post('/retweet', auth, postRetweet);
userRouter.patch('/like/:tweetId', auth, likeTweet);
userRouter.delete('/tweet/:id', auth, deleteTweetById);

userRouter.get('/profile/:username', auth, getUserProfile);
userRouter.get('/followers/:username', auth, getFollowersListByUsername);
userRouter.get('/following/:username', auth, getFollowingListByUsername);
userRouter.patch('/profile/:id', auth, updateUserById);
userRouter.patch('/follow/:username', auth, toggleFollowByUsername);

userRouter.post('/comment', auth, postComment);
userRouter.delete('/comment/:id', auth, deleteComment);

export default userRouter;
