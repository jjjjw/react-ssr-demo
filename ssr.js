require('node-jsx').install({harmony: true});

var App = require('./App.jsx');
var bodyParser = require('body-parser');
var express = require('express');

function renderApp (path, pageData, cb) {
  App.initialize(pageData);
  App.renderHtml(path, cb);
}

var server = express();
server.use(bodyParser.json());

server.post('/render', function (req, res) {
  var body = req.body;

  renderApp(body.path, body.page_data, function (html) {
    res.status(200).send(html);
  });
});

var serverInstance = server.listen(8081);
