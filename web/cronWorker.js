var path = require('path');
var htmlfetch = require(path.join(__dirname, '../workers/htmlfetcher'));
var archive = require('../helpers/archive-helpers');


archive.readListOfUrls((arr) => {
  console.log('cron ran');
  archive.downloadUrls(arr);
});

// cronworker script:
// * * * * * /usr/local/bin/node /Users/student/Desktop/2016-09-web-historian/web/cronWorker.js >/Users/student/Desktop/2016-09-web-historian/web/cronLog.txt 2>/Users/student/Desktop/2016-09-web-historian/web/cronLogError.txt