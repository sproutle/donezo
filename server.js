var express = require('express');
var app = express.createServer();

var secrets;
if (process.env.HOME === "/home/node") {
  secrets = require('/home/node/secrets');
}
else {
  secrets = require('./secrets');
}

app.use(express.logger());
app.use(express.bodyParser());

app.use(express.cookieParser());
app.use(express.session({secret: "lamp_post"}));



//GET function, home page//
app.get('/', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("home.ejs", {username:req.session.username});
});
 
 //GET login function, login page//
app.get('/login', function(req, res) {
  res.render("login.ejs");
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

//GET account function, account page//
app.get('/account', function(req, res) {
   if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("account.ejs", {username:req.session.username});
});

//GET todo function, todo page//
app.get('/todo', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("todo.ejs", {username:req.session.username});
});

//GET project function, projects page//
app.get('/project', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("project.ejs", {username:req.session.username});
});

//GET task function, task page//
app.get('/task', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("task.ejs", {username:req.session.username});
});

//GET new_user function, new user page//
app.get('/new_user', function(req, res) {
  res.render("new_user.ejs");
});



 app.use(express.static(__dirname + '/public'));

var users= {
  "username": "password",
  "Laurainne": "lamp_post",
  "Luna": "awesome"
};

var port = process.env.PORT || 8080;
app.listen(port);