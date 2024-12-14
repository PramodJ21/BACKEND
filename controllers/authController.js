const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendAccountCreationEmail } = require('../emailService');

exports.signup = async (req, res) => {
    const { name, phone, username, email, password } = req.body;
    try {
        // Validate input
        if (!name || !phone || !username || !email || !password) {
            console.log(name,phone,username,email,phone)
            return res.status(400).json({ error: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ error: "User with this email or username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, phone, username, email, password: hashedPassword });
        await user.save();

        let emailSent = false;
        try {
            await sendAccountCreationEmail(user.email);
            emailSent = true;
        } catch (emailError) {
            console.error('Error sending account creation email:', emailError);
        }

        res.status(201).json({ 
            message: emailSent ? 'User created successfully and confirmation email sent' : 'User created successfully, but confirmation email could not be sent',
            user
        });

    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 11000) {
            res.status(400).json({ error: "User with this email or username already exists" });
        } else {
            res.status(500).json({ error: "Error signing up user" });
        }
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username,password)
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ 
            token,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Error logging in user" });
    }
};

exports.logout = async (req,res) => {
    try {
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: "Error logging out user" });
    }
}