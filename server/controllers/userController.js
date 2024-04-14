import User from "../models/User.js";

// Fetches user's profile by username, excluding the password, and 
// includes whether the requestee user follows them or not. (incase of other people's profile)
const getUserProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the request is for the user's own profile
        if (req.user && req.user.username === username) {
            // This is the user's own profile
            res.json(user);
        } else {
            // This is another user's profile
            const isFollowing = user.following.includes(req.user._id);
            res.json({ ...user.toObject(), isFollowing });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Fetches the list of followers for a user by username.
const getFollowersListByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const followers = await User.find({ _id: { $in: user.followers } }).select('-password');
        res.json(followers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Fetches the list of users the specified user is following by username.
const getFollowingListByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const following = await User.find({ _id: { $in: user.following } }).select('-password');
        res.json(following);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Updates the user's profile information, excluding the password.
const updateUserById = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['profilePicture', 'bio', 'coverPicture', 'fullName'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates!' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Toggles the follow status between the current user and the specified user.
const toggleFollowByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const currentUser = await User.findById(req.user._id);
        const alreadyFollowing = currentUser.following.includes(user._id);

        if (alreadyFollowing) {
            currentUser.following.pull(user._id);
            user.followers.pull(req.user._id);
        } else {
            currentUser.following.push(user._id);
            user.followers.push(req.user._id);
        }

        await currentUser.save();
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getUserProfile,
    getFollowersListByUsername,
    getFollowingListByUsername,
    updateUserById,
    toggleFollowByUsername
};