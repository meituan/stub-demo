var http = require('http');
var app = require('express')();
var ENABLE_MOCK = true;

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// automatic template locator
app.use(function(req, res, next) {
    req.template = req.path.slice(1) || 'index';
    next();
});

// mock data middleware
if (ENABLE_MOCK) {
    // manually start stub http server
    // ./bin/stub-http -p 8088 ./fixtures &
    app.use(function(req, res) {
        var request = http.request({
            host: 'localhost',
            port: '8088',
            path: '/',
            method: 'POST',
        }, function(response) {
            response.on('data', function(chunk) {
                chunk = JSON.parse(chunk.toString());
                res.render(req.template, chunk.body);
            });
        });
        request.end(JSON.stringify({ uri: req.originalUrl, method: req.method }));
    });
}

// actual busness logic
app.get('/', function(req, res) {
    // fetch data from backend
    var data = {
        key: 'value',
    };
    res.render(req.template, data);
});

app.listen(3000);
