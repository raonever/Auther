//jshint esversion:6
require('dotenv').config()        // 암호화 키를 .env로 숨기기위한 셋팅. 맨 윗 줄에 있어야 함.
const express = require("express");         // 1-1) express, bady-parser, ejs npm 등록
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();    // 1-2) app 선언, ejs 셋팅, bodyParser, express 설정

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({   // 데이터 베이스 스키마 설정
  email: String,
  password: String
});

// sceret 변수를 .env로 이동. .env는 띄어쓰기, ""(따옴표), ;(세미콜론) 를 사용하지 않음
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){     // save할 때 암호화
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){   // 찾을 때 복호화
    if (err){
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  })
})

app.listen(3000, function() {                 // 1-3) 포트 설정
  console.log("Server started on port 3000");
});
