//jshint esversion:6
const express = require("express");         // 1-1) express, bady-parser, ejs npm 등록
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();    // 1-2) app 선언, ejs 셋팅, bodyParser, express 설정
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {    // 3-2) 몽구스 연결
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = {
  email: String,
  password: String
};

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

  newUser.save(function(err){
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
  // DB의 email 필드 중에서 사용자가 입력한 username과 같은 것을 찾음
  User.findOne({email: username}, function(err, foundUser){
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
