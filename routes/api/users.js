const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load user model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @acces   Public access

router.get("/test", (req, res) => {
    res.json({
        message: "Users works"
    });
});

// @route   GET api/users/register
// @desc    Registration of user
// @acces   Public access

router.post("/register", (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({ email: "email already exists" });
        } else {
            const { name, email, password } = req.body;
            const newUser = new User({
                name: name,
                email: email,
                avatar: gravatar.url(email, {
                    s: "200",
                    r: "pg",
                    default: "mm"
                }),
                password: password
            });
            // Generate hash
            bcrypt
                .genSalt(10)
                .then(salt => bcrypt.hash(password, salt))
                .catch(err => res.status(400).json("Server error"))
                .then(hash => {
                    newUser.password = hash;
                    return newUser.save();
                })
                .catch(err => {
                    res.status(400).json("Internal server error");
                })
                // Add user to db
                .then(user => res.json(user))
                .catch(err => res.status(400).json("Database error"));
        }
    });
});

module.exports = router;
