import Comment from "../models/Comment.js";
import Tweet from "../models/Tweet.js";

// Function to post a comment
const postComment = async (req, res) => {
    try {
        let { user, tweet, commentText, image } = req.body;
        // Create a new comment using the Comment model
        const comment = new Comment({
            user, // user ID 
            tweet, // tweet ID 
            commentText, 
            image // Image is optional
        });

        // Save the comment to the database
        await comment.save();

        // Update the tweet to include the new comment
        await Tweet.findByIdAndUpdate(tweet, {
            $push: { comments: comment._id }
        });

        // Send a success response
        res.status(201).json({
            message: "Comment posted successfully",
            comment: comment
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            message: "Error posting comment",
            error: error.message
        });
    }
};

// Function to delete a comment
const deleteComment = async (req, res) => {
    try {
        // Find and delete the comment by its ID
        const result = await Comment.findByIdAndDelete(req.params.id);

        // Check if the comment was found and deleted
        if (!result) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Find the tweet and remove the deleted comment's ID from its comments array
        await Tweet.findByIdAndUpdate(result.tweet, {
            $pull: { comments: result._id }
        });

        // Send a success response
        res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            message: "Error deleting comment",
            error: error.message
        });
    }
};
export {
    postComment,
    deleteComment
}