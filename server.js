var express = require('express');
var app = express.createServer();
var nano = require('nano');

var secrets;
if (process.env.HOME === "/home/node") {
  secrets = require('/home/node/secrets');
}
else {
  secrets = require('./secrets');
}

var db = nano("https://" + secrets.username + ":" + secrets.password + "@sproutle.cloudant.com/donezo-demo");
db.list(function (err, body) {
  if (err) throw err;
  body.rows.forEach(function (item, index) {
  });
});

CouchStore.prototype.__proto__ = express.session.Store.prototype;
function CouchStore(db) {
  this.db = db;
}

CouchStore.prototype.get = function (sid, callback) {
  this.db.get(sid, function (err, body) {
    if (err) {
      if (err.error === "not_found") {
        return callback();
      };
      return callback(err);
    }
    callback(null, body);
  });
};

CouchStore.prototype.set = function (sid, session, callback) {
  this.db.insert(session, sid, function (err, body) {
    if (err) return callback(err);
    callback();
  });
};

CouchStore.prototype.destroy = function (sid, callback) {
  callback(new Error("TODO: implement clear"));
};

CouchStore.prototype.length = function (callback) {
  callback(new Error("TODO: implement length"));
};

CouchStore.prototype.clear = function (callback) {
  callback(new Error("TODO: implement clear"));
};

app.use(express.logger());
app.use(express.bodyParser());

app.use(express.cookieParser());
app.use(express.session({secret: "lamp_post", store: new CouchStore(db)}));



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
app.get('/projects/:project_id', function(req, res, next) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  db.view("tasks", "all", {startkey: [req.params.project_id], endkey: [req.params.project_id, 100]}, function(err, body) {
    if (err) return next(err);
    var project = body.rows.splice(0, 1)[0].value;
    var rows = body.rows.map(function (row) { return row.value; });
    res.render("project.ejs", {username:req.session.username, rows:rows, project:project});
  })
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

//GET profile function, profile page//
app.get('/profile', function(req, res) {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("profile.ejs", {username:req.session.username});
});



 app.use(express.static(__dirname + '/public'));

var users= {
  "username": "password",
  "Laurainne": "lamp_post",
  "Luna": "awesome"
};

var port = process.env.PORT || 8080;
app.listen(port);