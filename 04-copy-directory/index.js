const fs = require("fs");
const path = require("path");
let link = path.join(__dirname, 'files');

function createDirectory(directoryPath) {
    const directory = path.normalize(directoryPath);
    return new Promise((resolve, reject) => {
      fs.stat(directory, (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            fs.mkdir(directory, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve(directory);
              }
            });
          } else {
            reject(error);
          }
        } else {
          resolve(directory);
        }
      });
    });
  }

const directoryPath = `${__dirname}/files-copy`;

createDirectory(directoryPath).then((path) => {}).catch((error) => {
  console.log(`Problem creating directory: ${error.message}`)
});

var old = [];
var copy = [];

function pushdata(done){
  fs.readdir(link, 
      { withFileTypes: true },
      (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach(file => {
          if(file.isDirectory()){} //...
          fs.copyFile(path.join(link, file.name), path.join(directoryPath, file.name), (err) => {
            if (err) throw err;
          });
          old.push(file.name);
        })
      }
      done();
  });
  fs.access(directoryPath, function(err) {
    if (err && err.code === 'ENOENT') {
      createDirectory(directoryPath) ;
    } else{
      fs.readdir(directoryPath,
        { withFileTypes: true },
        (err, copies) => {
          if (err) console.log(err);
          else{
            copies.forEach(c => {
              copy.push(c.name);
            })
          }
          done();
      });
    }
  });
}

pushdata(function () {
    if (Array.isArray(copy) && copy.length){
      var is_same = (old.length == copy.length) && old.every(function(element, index) {
        return element === copy[index]; 
      });

      if(!is_same){
        var result = array_diff(copy, old);
        for(let i = 0; i < result.length; i++){
          fs.unlink(path.join(directoryPath, result[i]), (err) => {
            if (err && err.code == "ENOENT") {
              console.info("Error! File doesn't exist.");
            }
          });
        }
      }
  }
}); 

var array_diff = function (l, r) {
  return l.filter(function (v) {
      return r.indexOf(v) == -1;
  });
};
