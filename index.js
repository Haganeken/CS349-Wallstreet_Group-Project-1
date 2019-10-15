let http = require('http');
let fs = require('fs');
let mime = require('Mime');
let extract = require('./extract');


let handleError = function (err, res) {
    res.writeHead(404);

    fs.readFile("./app/error.html", function (err, data) {
        if (err) {
            throw err;
        } else {
            res.end(data);
        }
    })
};

let server = http.createServer(function (req, res) {
    var filePath = extract(req.url);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            handleError(err, res);

        } else {
            res.setHeader('Content-Type', mime.getType(filePath));
            res.end(data);
        }
    })
});

server.listen(3000);
