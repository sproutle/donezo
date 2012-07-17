var express = require('express');
var app = express.createServer();

app.use(express.logger());
app.use(express.bodyParser());

app.use(express.cookieParser());
app.use(express.session({secret: "lamp post"}));

app.get('/', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  console.log(req.session);
  res.render("home.ejs", {username:req.session.username});
});
 
app.get('/login', function(req, res) {
  res.render("login.ejs")
});

app.post('/login', function(req, res) {
  console.log(req.body , req.body.username , users[req.body.username] , req.body.password);
  if (users[req.body.username] === req.body.password) {
    req.session.username = req.body.username;
    res.redirect("/");
    return;
  }
  res.redirect("/login");
});

app.post('/logout', function(req, res) {
  req.session.username = false;
  res.redirect("/login");
});

app.listen(8080);

var users= {
  "username": "password"
};
