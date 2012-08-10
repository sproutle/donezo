var express = require('express');
var app = express.createServer();
var nano = require('nano');
var secrets = require('./secrets');

app.use(express.logger());
app.use(express.cookieParser());
app.use(express.session({secret: "他们的专业知识与" }));
app.use(express.bodyParser());
app.use(express.static(__dirname + "/public"));

app.listen(8000);

console.log("http://localhost:8000/");

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
  this.db.destroy(sid, null, function (err, body) {
    if (err) return callback(err);
    callback();
  });
};

// CouchStore.prototype.length = function (callback) {
//   callback(new Error("TODO: implement length"));
// };

// CouchStore.prototype.clear = function (callback) {
//   callback(new Error("TODO: implement clear"));
// };


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
  res.send(db.projects);
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

function checkSession(req, res, next) {
  if (!req.session.username) {
    res.code = 403;
    res.end("Please login");
  }
  else {
    next();
  }
}

var db = {
  users: {
    creationix: "noderocks"
  },
  sessions: {},
  projects: {
    asd5f4a7sd4f: {
      id: "asd5f4a7sd4f",
      title: "My Project",
      tasks: [
        {title: "My title", description: "My description"},
        {title: "Another title", description: "Another description"}
      ]
    }
  }
};
