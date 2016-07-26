var request = require('request');
var fs = require('fs');

var download = function(url, dest) {
    var file = fs.createWriteStream(dest);
    request(url).pipe(file);
};

var i;
for (i = 430; i < 950; i++ ) {
    download('https://www.blueapron.com/recipes/' + i, __dirname + '/downloaded/'+ i +'.html');
}
