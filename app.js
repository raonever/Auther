//jshint esversion:6
require('dotenv').config()        // 암호화 키를 .env로 숨기기위한 셋팅. 맨 윗 줄에 있어야 함.
const express = require("express");         // 1-1) express, bady-parser, ejs npm 등록
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");    // bcrypt
const saltRounds = 10;

const app = express();    // 1-2) app 선언, ejs 셋팅, bodyParser, express 설정

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {    // bcrypt
    const newUser = new User({
      email: req.body.username,
      password: hash     // 암호화
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){   // 찾을 때 복호화
    if (err){
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {     // bcrypt, 복호화
          if (result === true) {
              res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function() {                 // 1-3) 포트 설정
  console.log("Server started on port 3000");
});
