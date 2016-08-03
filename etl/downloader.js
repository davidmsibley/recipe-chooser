var request = require('request');
var fs = require('fs');

limitedRequest = request.defaults({ pool : {maxSockets : 10} });
var download = function(url, dest) {
    var file = fs.createWriteStream(dest);
    limitedRequest(url)
    .on('response', function(response) {
        console.log(response.statusCode, url)
    })
    .on('error', function(error) {
        console.log(error)
    })
    .pipe(file);
};

var i;
for (i = 450; i < 950; i++ ) {
    download('https://www.blueapron.com/recipes/' + i, __dirname + '/downloaded/'+ i +'.html');
}
