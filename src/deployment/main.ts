// don't forget to install dependencies before running the server
// $ npm i && node main.ts

const startHttp = () => {
  const finalhandler = require('finalhandler')
  const http = require('http')
  const serveStatic = require('serve-static');

  const handler = serveStatic(__dirname, {'index': ['index.html']})
  http.createServer((req, res) => {
    req.url = req.url.replace('/mykola', '');
    if (!req.url.length || ['/', '/plus', '/bulk-edit', '/dropdown', '/tags'].filter(p => req.url == p).length == 1) { // angular routing, server index.html
      req.url = '/';
    }
    handler(req, res, finalhandler(req, res));
  }).listen(process.env['PORT'] || 3000, '0.0.0.0', 511, () => console.log('Started HTTP Server'));
};

startHttp();
