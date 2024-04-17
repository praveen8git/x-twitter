// importing necessary modules and dependencies for the authentication 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {

    try {
        const { fullName, username, email, password, passwordConfirm } = req.body;
        
        // Validation
        if (!(fullName && username && email && password, passwordConfirm)) {
            res.status(400).json({ message: "All fields are mandatory!" })
            return
        }

        if(password !== passwordConfirm) {
            res.status(400).json({ message: "Password & Confirm Password must be same!" })
            return
        }

        const userExist = await User.findOne({ username: username });
        const emailExist = await User.findOne({ email: email });

        if (userExist) {
            res.status(400).json({ message: "This username is already taken!" })
            return
        }
        if (emailExist) {
            res.status(400).json({ message: "This email already registered!" })
            return
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username,
            email,
            password: encryptedPassword
        });

        const token = jwt.sign({ 
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            subscription: user.subscription,
            profilePicture: user.profilePicture
         }, JWT_SECRET);

        user.token = token;
        user.password = undefined;

        const options = {
            // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: true, // Set to true if your site is served over HTTPS
            sameSite: 'none' // Consider setting this if your frontend and backend are on different domains
        }

        res.status(201).cookie("token", token, options).json({ success: true, user });
        console.log("A new user:", user.username, "registered!");


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).json({ message: "All fields are mandatory!" });
            return
        }

        const user = await User.findOne({ username: username });
        if (!user) {
            res.status(401).json({ message: "Incorrect username!" });
            return
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            res.status(401).json({ message: "Incorrect password!" });
            return
        }

        const token = jwt.sign({ 
            _id: user._id,
            fullName: user.fullName, 
            username: user.username,
            subscription: user.subscription,
            profilePicture: user.profilePicture
         }, JWT_SECRET);

        user.token = token;
        user.password = undefined;

        const options = {
            // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
            // expires: new Date(Date.now() + 1 * 60 * 1000), // 1 min
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: true, // Set to true if your site is served over HTTPS
            sameSite: 'none' // Consider setting this if your frontend and backend are on different domains
        }

        res.status(201).cookie("token", token, options).json({ success: true, user });
        console.log("user:", user.username, "logged in!");


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
}

const isLoggedIn = (req, res) => {
    const { user } = req;
    res.status(201).json({ success: true, user });
}

const logout = async (req, res) => {
    await res.clearCookie('token', { 
        httpOnly: true,
        secure: true, // Set to true if your site is served over HTTPS
        sameSite: 'none' // Consider setting this if your frontend and backend are on different domains
    });
    res.status(201).json({ success: true, message: "Logged out succesfully!" });

    // res.redirect('/');
}


export { register, login, logout, isLoggedIn };