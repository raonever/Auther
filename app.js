//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");   // 1) Passport setting (Line 7~9)
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({                             // 2) session 설정;
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());             // 3) passport 설정(초기화 및 세션 관리 설정)
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);  // 7) 버전업으로 인해 추가된 사항

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);     // 4) 스키마에 passportLocalMongoose 플러그인 추가

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());  // 5) pastport 선언

passport.serializeUser(User.serializeUser());         // 6) 쿠키 생성(serial~~) 및 쿠키 파괴(deser~~)
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/secrets", function(req, res){   // 12) secrets 페이지의 로그인 상태 확인
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res){      // 14) 로그아웃
  req.logout();
  res.redirect("/");
})

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){  // 11) passport를 이용하여 post
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){      // 11-1)사용자를 인증하고 로그인 세션을 성정하기 때문에 secrets 페이지로 직접 이동하더라도 볼 수 있음
        res.redirect("/secrets");
      });
    }
  });

});

// app.post("/login", function(req, res){
//
//   const user = new User({                 // 13-1) user에 id, pw를 저장
//     username: req.body.username,
//     password: req.body.password
//   });
//
//   req.login(user, function(err){          // 13-2) passport 이용하여 로그인
//     if (err) {
//       console.log(err);
//     } else {
//       // passport.authenticate("local", { failureRedirect: '/login' })(req, res, function(){      // 11-1) 과 같음
//       //   res.redirect("/secrets");
//       // });
//       passport.authenticate("local", { failureRedirect: '/login' }) {
//         req, res, function() {      // 11-1) 과 같음
//           res.redirect("/secrets");
//         };
//       }
//     }
//   });
// });

app.post("/login", function(req, res){

  const user = new User({                 // 13-1) user에 id, pw를 저장
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){          // 13-2) passport 이용하여 로그인
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local', { failureRedirect: '/login' })(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});

app.listen(3000, function() {                 // 1-3) 포트 설정
  console.log("Server started on port 3000");
});
