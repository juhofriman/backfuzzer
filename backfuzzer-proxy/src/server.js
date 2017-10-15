var http = require('http');
var cp = require('child_process');

var codes = [300, 301, 302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407,
  408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 426, 428, 429, 431,
  444, 451, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511,599];

http.createServer(function (req, res) {

  cp.exec('echo ' + req.headers.toString() + '| /app/radamsa/bin/radamsa',  function (error, stdout, stderr) {
    res.writeHead(codes[Math.floor(Math.random() * codes.length)], {'Content-Type': 'text/plain'});
    res.end(stdout);
  });

}).listen(5000);
