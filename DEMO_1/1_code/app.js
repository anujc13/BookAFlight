const http = require("http");
var sql= require('mysql');

const webServer = http.createServer(applicationServer);
webServer.listen(8000);

