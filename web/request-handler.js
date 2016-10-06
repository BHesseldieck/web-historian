var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!
var fs = require('fs');

exports.handleRequest = function (req, res) {

  var pathURL = req.url.split('?')[0].split('/'); 
  var query = req.url.split('?')[1];

  var answer = '';
  var statusCode = 404;

  if (req.method === 'GET') {
    if (pathURL.join('/') === '/' || pathURL === '/favicon.ico') {
      fs.readFile(archive.paths.siteAssets + '/index.html', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
      });
    } else if (pathURL.join('/') === '/styles.css') {
      fs.readFile(archive.paths.siteAssets + '/styles.css', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/css', 'Content-Length': data.length});
        res.write(data);
        res.end();
      });
    } else {
      archive.isUrlArchived(pathURL[pathURL.length - 1], (bool) => {
        if (bool) {
          fs.readFile(archive.paths.archivedSites + '/' + pathURL[pathURL.length - 1], (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
            res.write(data);
            res.end();
          });
        } else {
          res.writeHead(statusCode, helpers.headers);
          res.end('404 - Site not archived, go back to Home and submit a archive-request');
        }
      }); 
    }
  } else if (req.method === 'POST') {
    var websiteReq = '';
    req.on('data', data => {
      websiteReq += data;
      websiteReq = websiteReq.slice(4) + '\n';
    });
    req.on('end', () => {
      var pureURL = websiteReq.slice(0, -1);
      archive.isUrlInList(pureURL, (bool) => {
        if (!bool) {
          archive.addUrlToList(websiteReq, (err) => {
            if (err) { throw err; }
            archive.readListOfUrls((arr) => {
              arr = arr.filter((e) => e !== '');
              archive.downloadUrls(arr);
            });
            fs.readFile(archive.paths.siteAssets + '/loading.html', (err, data) => {
              res.writeHead(302, {'Content-Type': 'text/html', 'Content-Length': data.length});
              res.write(data);
              res.end();
            });
          });
        } else {
          archive.isUrlArchived(pureURL, (bool) => {
            if (bool) {
              res.writeHead(302, {Location: 'http://localhost:8080/' + pureURL});
              res.end();
            } else {
              res.writeHead(500, helpers.headers);
              res.end('500 - Internal Server Error');
            }
          });
        }
      });
    });
  } else {
    res.writeHead(statusCode, helpers.headers);
    res.end(path.join(__dirname, '../archives/sites'));
  }
};