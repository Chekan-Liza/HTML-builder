var fs = require('fs');
const path = require('path');

let file = path.join(__dirname, 'text.txt');

var stream = new fs.ReadStream(file, {encoding: 'utf-8'});
 
stream.on('readable', function(){
    var data = stream.read();
    if(data != null) console.log(data); 
});

stream.on('error', function(err){
    if(err.code == 'ENOENT'){
        console.log("Файл не найден!");
    }else{
        console.error(err);
    }
});
