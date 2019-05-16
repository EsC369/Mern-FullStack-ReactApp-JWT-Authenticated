const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");   // Deprecated: Express has its own body parser
const Items = require("./routes/api/items");
const Users = require("./routes/api/users");
const Auth = require("./routes/api/auth");
const path = require("path");
const config = require("config");

const port = process.env.PORT || 5000;
const app = express();

// Body Parser:
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());   DEPRACTED IS now called as such:
app.use(express.json());

// DB Config:
// const db = require("./config/keys").mongoURI;
// Utilizing config to hold and use keys
const db = config.get("mongoURI");

// Routes:
app.use("/api/items", Items);
app.use("/api/users", Users);
app.use("/api/auth", Auth);

// Serve Static Assets(build folder) if in production:
if(process.env.NODE_ENV == "production") {
    // Set Static Folder:
    app.use(express.static("client/build"));
    // Get anything "*"
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

// // Connect to Mongo:
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true})
    .then(() => console.log("Mongo DB Connected..."))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Server Running On Port: ${port}`));