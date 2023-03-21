const http = require("http");
var sql= require('mysql');

const webServer = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
}).listen(8080);


var connection = sql.createConnection({
    host : "localhost",
    user: "root",

})