var app = require('express')();
var shell = require('shelljs');
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
    app.use(function(req, res) {
        var request = { uri: req.originalUrl, method: req.method };
        var requestStr = escapeshellarg(JSON.stringify(request));
        var response = shell.exec('./bin/mock "./fixtures" ' + requestStr, {silent: true}).output;
        response = JSON.parse(response);
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

// @see https://github.com/kvz/phpjs/blob/master/functions/exec/escapeshellarg.js
function escapeshellarg(arg) {
  //  discuss at: http://phpjs.org/functions/escapeshellarg/
  // original by: Felix Geisendoerfer (http://www.debuggable.com/felix)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: escapeshellarg("kevin's birthday");
  //   returns 1: "'kevin\\'s birthday'"

  var ret = '';

  ret = arg.replace(/[^\\]'/g, function (m) {
    return m.slice(0, 1) + '\\\'';
  });

  return "'" + ret + "'";
}
