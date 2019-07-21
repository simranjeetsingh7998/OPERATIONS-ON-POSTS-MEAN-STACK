const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();  // to create express app

mongoose.connect("mongodb+srv://simran:" + process.env.MONGO_ATLAS_PW + "@cluster0-qoo5n.mongodb.net/node-angular",{useNewUrlParser: true})
.then(() => {                                     // .net/test? -> test is the name of the DB in which we are 
    console.log('Connected to DB');               // are storting our data but we can chnge the name of the DB
})
.catch(() => {
    console.log('Connection failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));  // for fetching images for the front end

app.use((req,res,next) => {   //for removing the CORS error for all the incoming requests when we are sharing data from
                              //one server to another
    res.setHeader("Access-Control-Allow-Origin","*");  //headers understood by the browser
    res.setHeader("Access-Control-Allow-Headers",
                  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

module.exports = app;    // exporting our express app to server