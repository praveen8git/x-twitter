import Comment from "../models/Comment.js";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

const postTweet = async (req, res) => {
    try {
        const { text, image } = req.body;
        const tweet = new Tweet({
            tweetBy: req.user._id,
            text,
            image,
        });
        await tweet.save();
        res.status(201).json(tweet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTweetById = async (req, res) => {
    try {
        const { id } = req.params;
        const tweet = await Tweet.findById(id);

        if (!tweet) {
            return res.status(404).json({
                message: "Tweet not found"
            });
        }

        // Find and delete all comments associated with the tweet
        await Comment.deleteMany({ tweet: id });

        // Delete the tweet
        await Tweet.findByIdAndDelete(id);

        // Update the user to remove the deleted tweet's ID from its tweets array
        await User.findByIdAndUpdate(tweet.user, {
            $pull: { tweets: id }
        });

        res.status(200).json({
            message: "Tweet and its comments deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting tweet and its comments",
            error: error.message
        });
    }
};

const likeTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { _id } = req.user;
        let tweet = await Tweet.findById(tweetId);

        if (tweet.likes.includes(username)) {
            // filter the username so that post get unliked
            tweet.likes = tweet.likes.filter(id => id.toString() !== _id.toString());
        } else {
            // add the username to like the post
            tweet.likes.push(_id);
        }
        await tweet.save();
        res.status(200).json(tweet);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const postRetweet = async (req, res) => {
    try {
        const { tweetId } = req.body;
        const userId = req.user._id;
        let tweet = await Tweet.findById(tweetId);

        // Create a new tweet as a retweet
        const retweet = new Tweet({
            tweetBy: userId,
            text: tweet.text,
            image: tweet.image,
            retweetedThis: [tweetId],
        });

        await retweet.save();
        res.status(201).json(retweet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTweetById = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const tweet = await Tweet.findById(tweetId).populate({
            path: 'tweetBy',
            select: '-password'
        }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: '-password'
            }
        }).populate(['retweetedThis']);
        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().populate({
            path: 'tweetBy',
            select: '-password'
        }).populate('retweetedThis').sort({ createdAt: -1 });
        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    postTweet,
    deleteTweetById,
    likeTweet,
    postRetweet,
    getTweetById,
    getAllTweets
}