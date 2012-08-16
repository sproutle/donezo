// use these files
var express = require('express');
var app = express();
var nano = require('nano');
var secrets = require('./secrets');

// express uses
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.session({secret: "他们的专业知识与" }));
app.use(express.bodyParser());
app.use(express.static(__dirname + "/public"));

// its listening
app.listen(8000);
console.log("http://localhost:8000/");

// uses the database form cloudant
var db = nano("https://" + secrets.username + ":" + secrets.password + "@sproutle.cloudant.com/donezo-demo");
db.list(function (err, body) {
  if (err) throw err;
  body.rows.forEach(function (item, index) {
  });
});

// couch prototypes
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
  this.db.destroy(sid, null, function (err, body) {
    if (err) return callback(err);
    callback();
  });
};

app.post("/register", function (req, res) {
  if (!db.users[req.body.username]) {
    db.users[req.body.username] = req.body.password;
    req.session.username = req.body.username;
  }
  res.send(req.session);
});

// routes
app.post("/login", function (req, res) {
  console.log(req.body, db.users[req.body.username]);
  if (db.users[req.body.username] === req.body.password) {
    req.session.username = req.body.username;
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
    } else {
      req.session.cookie.maxAge = null;
    }
  }
  res.send(req.session);
});

app.get("/session", function (req, res) {
  res.send(req.session);
});

app.post("/logout", function (req, res, next) {
  req.session.regenerate(function (err) {
    if (err) return next(err);
    res.send(req.session);
  });
});

app.get("/projects", checkSession, function (req, res) {
  res.send(Object.keys(db.projects).map(function (id) {
    return db.projects[id];
  }));
});

app.get("/projects/:id", checkSession, function (req, res, next) {
  var project = db.projects[req.params.id];
  if (!project) return next();
  res.send(project);
});

app.put("/projects/:id", checkSession, function (req, res, next) {
  db.projects[req.params.id] = req.body;
  console.log("DB", db);
  res.send(true);
});


// session check
function checkSession(req, res, next) {
  if (!req.session.username) {
    res.code = 403;
    res.end("Please login");
  }
  else {
    next();
  }
}

// database
var db = {
  users: {
    creationix: "noderocks"
  },
  sessions: {},
  projects: {
    asd5f4a7sd4f: {
      id: "asd5f4a7sd4f",
      title: "My Project",
      description: "My project's awesome description",
      dueDate: "2012/09/11",
      tasks: [
        {title: "My title", description: "My description"},
        {title: "Another title", description: "Another description"}
      ],
      comments: [
        {user: "creationix", content: "this project is awesome!", date: "2012/8/15"},
        {user: "creationix", content: "this project is more awesome!", date: "2012/8/16"}
      ]
    }
  }
};
