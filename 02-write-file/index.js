var fs = require('fs');
const path = require('path');
const process = require('process');

let file = path.join(__dirname, 'text.txt');
var writer = fs.createWriteStream(file); 

console.log('Hello my friend! Do you want to write something here?..\n'); 

var stdin = process.stdin;

stdin.setRawMode(true);

stdin.resume();

stdin.setEncoding('utf8');

stdin.on('data', function(data){
    // ctrl-c
    if (data === '\u0003'){
        end();
    }

    process.stdout.write(data);
    writer.write(data); 
   
    var stream = new fs.ReadStream(file, {encoding: 'utf-8'});
 
    stream.on('readable', function(){
        var message = stream.read();
        if(message && message.toString().includes('exit')){
            fs.writeFile(file, '', function(){});
            writer.write(message.toString().replace(/exit/i, ''));
            end();
        }
    });
});

function end(){
    console.log('\nDon\'t get lost! Goodbye.'); 
    process.exit();
}
