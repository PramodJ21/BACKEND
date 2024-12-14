const express = require("express");
const User = require('../models/User')
const router = express.Router();

router.get('/users',async (req,res) => {
    try{
    const users = await User.find();
    res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error:err})
    }
})

router.delete('/users',async (req,res) => {
    try{
        const {userId} = req.body;
        const user = await User.findByIdAndDelete(userId);
        res.status(200).json({message: "User deleted successfully"})
    }
    catch(err){
        res.status(500).json({error:err})
    }
})

router.get("/:userId", (req,res) => {
    const { userId } = req.params;
    User.findById(userId)
        .then(user => {
            if (user) {
                res.json(user );
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Error fetching user' });
        });

});
router.put("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { name, phone, username, email, password } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update fields if they are provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (username) user.username = username;
        if (email) user.email = email;

        // If a new password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user
        await user.save();

        // Return the updated user (excluding password)
        const updatedUser = await User.findById(userId).select('-password');
        res.json(updatedUser);

    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 11000) {
            // MongoDB duplicate key error
            res.status(400).json({ error: 'Username, email, or phone number already in use' });
        } else {
            res.status(500).json({ error: 'Error updating user' });
        }
    }
});


module.exports = router;