const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//DB
const db = require("./config/keys").mongoURI;

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
