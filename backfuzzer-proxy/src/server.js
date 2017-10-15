var http = require('http');
var cp = require('child_process');

function responseAsString(response, body) {
  var c = "HTTP/" + response.httpVersion + " " + response.statusCode + " " + response.statusMessage + "\n";
  for(var item in response.headers) {
    c += item + ": " + response.headers[item] + "\n";
  }

  c += "\n";
  c += body;
  console.log(c);
  return c;
}

http.createServer(function (req, res) {

  http.request({
    host: "upstream",
    port: "4000",
    path: req.url,
    method: req.method}, function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        if(response.statusCode >= 400) {
          cp.exec('echo "' + responseAsString(response, str) + '" | /app/radamsa/bin/radamsa',  function (error, stdout, stderr) {
            req.connection.write(stdout);
            req.connection.end();
          });
        } else {
          res.writeHead(response.statusCode, {'Content-Type': response.headers["content-type"]});
          res.end(str);
        }
      });
  }).end();

}).listen(5000);
