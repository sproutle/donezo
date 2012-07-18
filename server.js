//use express now, create server//
var express = require('express');
var app = express.createServer();

//checks login//
app.use(express.logger());
app.use(express.bodyParser());

//cookie and session while logged in//
app.use(express.cookieParser());
app.use(express.session({secret: "lamp_post"}));

//GET function, home page//
app.get('/', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  console.log(req.session);
  res.render("home.ejs", {username:req.session.username});
});
 
 //GET login function, login page//
app.get('/login', function(req, res) {
  res.render("login.ejs")
});

//POST login function, logs in//
app.post('/login', function(req, res) {
  if (users[req.body.username] === req.body.password) {
    req.session.username = req.body.username;
    res.redirect("/");
    return;
  }
  res.redirect("/login");
});

//POST logout function, logs out//
app.post('/logout', function(req, res) {
  req.session.username = false;
  res.redirect("/login");
});

//can now use public folder//
 app.use(express.static(__dirname + '/public'));

//example database for users/passwords//
var users= {
  "username": "password"
};

app.listen(8080);

console.log(__dirname);