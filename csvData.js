var csv = require('csv');
var fs = require('fs')
input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];

csv.stringify(accInput, function(err, output){
  fs.writeFile("accData", output, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
});

csv.stringify(gyroInput, function(err, output){
  fs.writeFile("accData", output, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
});
