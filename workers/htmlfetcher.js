var fs = require('fs');
var http = require('http');
var archive = require('../helpers/archive-helpers');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
exports.download = (URL) => {
  console.log('started download of ' + URL);
  var req = http.get({host: URL}, (response) => {
    var html = '';
    response.on('data', data => { html += data; });
    response.on('end', () => {
      fs.writeFile(archive.paths.archivedSites + '/' + URL, html);
    });
  });
};
