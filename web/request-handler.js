var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!
var fs = require('fs');

exports.handleRequest = function (req, res) {

  var pathURL = req.url.split('?')[0];
  var query = req.url.split('?')[1];
  console.log(pathURL, query);
  var answer = '';
  var statusCode = 404;

  if (req.method === 'GET') {
    if (pathURL === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
      });
    } else if (pathURL === '/styles.css') {
      fs.readFile(archive.paths.siteAssets + '/styles.css', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/css', 'Content-Length': data.length});
        res.write(data);
        res.end();
      });
    } else {
      // var pathArr = pathURL.split('/');
      // fs.readFile(archive.paths.archivedSites + '/' + pathArr[pathArr.length - 1], 'UTF-8', (err, data) => {
      //  if (err) {
      //   console.log('ERROR, File does not exist');
      //  } else {
      //   res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
      //   res.write(data);
      //   res.end();
      //  }
      // });'
      res.writeHead(statusCode, helpers.headers);
      res.end();
    } 
  }
};