const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../../config/keys");

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

// @route   POST api/users/register
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

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @acces   Public access
// TODO: Add bad creditinals error instaed of wrong email or password
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    //Find user
    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.status(404).json({ email: "User not found" });
            }
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User matches

                        //Create JWT payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        //Sign token

                        jwt.sign(
                            payload,
                            secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        );
                    } else {
                        return res
                            .status(400)
                            .json({ message: "Error password" });
                    }
                })
                .catch(err =>
                    res.status(400).json({ message: "Check failed" })
                );
        })
        .catch(err => res.status(400).json({ message: "Database error" }));
});

module.exports = router;
