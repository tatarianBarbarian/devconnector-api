const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//DB
const db = require("./config/keys").mongoURI;

mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const port = process.env.PORT || 3000;

//Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(port, () => {
    console.log(`The app is running on port ${port}`);
});
