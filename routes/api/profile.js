const express = require("express");
const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @acces   Public access

router.get("/test", (req, res) => {
    res.json({
        message: "Profile works"
    });
});

module.exports = router;
