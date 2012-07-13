var app = require('express').createServer();

app.get('/', function(req, res) {
  console.log(req.headers);
  res.end("GET /");
});
 
app.get('/login', function(req, res) {
  res.end("GET /login");
});

app.post('/login', function(req, res) {
  res.end("POST /login");
});

app.post('/logout', function(req, res) {
  res.end("POST /logout");
});

app.listen(8080);
