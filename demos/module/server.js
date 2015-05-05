var app = require('express')();
var Mock = require('monkeyjs');
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
    var mock = new Mock('./fixtures');
    app.use(function(req, res) {
        var response = mock.get(req.originalUrl);
        res.render(req.template, response.body);
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
