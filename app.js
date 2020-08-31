//jshint esversion:6
const express = require("express");         // 1-1) express, bady-parser, ejs npm 등록
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();    // 1-2) app 선언, ejs 셋팅, bodyParser, express 설정

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});





app.listen(3000, function() {                 // 1-3) 포트 설정
  console.log("Server started on port 3000");
});
