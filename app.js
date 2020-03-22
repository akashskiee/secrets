require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000 || process.env.PORT;
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/secretsDB", { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
 

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/logout", (req, res) => {
    res.redirect('/')
})


app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err) => {
            if(!err){
            res.render('secrets');
            } else {
                console.log(err);            
            }
        });
    });   
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.find({email: username}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                foundUser.forEach( user => {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if(result === true){
                            res.render('secrets');
                        }
                    });
                })
            }          
        }
    });
});


app.listen(port, () =>{
    console.log("App started at localhost:" + port);
    
})