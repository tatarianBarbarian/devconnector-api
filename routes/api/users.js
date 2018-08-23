const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @acces   Public access

router.get("/test", (req, res) => {
    res.json({
        message: "Users works"
    });
});

module.exports = router;
