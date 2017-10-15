var http = require('http');

function parseStatus(uri) {
  return parseInt(uri.substring(1))
}

http.createServer(function (req, res) {

  var s = parseStatus(req.url);
  if(isNaN(s)) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
  } else {
    res.writeHead(s, {'Content-Type': 'text/plain'});

  }
  res.end("Some data from the origin");

}).listen(4000);
