var fs = require('fs');
const path = require('path');
let link = path.join(__dirname, 'styles');

function createFile(filePath, css) {
  const file = path.normalize(filePath);
  return new Promise((resolve, reject) => {
    fs.stat(file, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.writeFile(file, css, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve(file);
              }
            });            
        } else {
          reject(error);
        }
      } else {
        resolve(file);
      }
    });
  });
}

const filePath = path.join(__dirname, 'project-dist', 'bundle.css');

createFile(filePath, '').then((path) => {}).catch((error) => {
  console.log(`Problem creating bundle.css: ${error.message}`)
});

var all = [];
var old = [];
var copy = [];

fs.readdir(link, 
  { withFileTypes: true },
  (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach(file => {
      if(!file.isDirectory() && path.extname(file.name) === '.css'){
          function pushdata(done){
              fs.readFile(path.join(link, file.name), 'utf8', function(error, data){
                  if(error) throw error;
                  else {
                      if(data != null) all.push(data);
                  }
                  done();
              });
          }

          pushdata(function () {
            fs.writeFile(filePath, all.join(''), (error) => {
              if(error) throw error;
            });
            
            copy = all;
          });
      }     
    });
  }
})

function pushdata2(done){
  fs.readFile(filePath, 'utf8', (err, files) => {
      if (err){
        createFile(filePath, all.join(''),).then((path) => {}).catch((error) => {
          console.log(`Problem creating bundle.css: ${error.message}`)
        });
      }
      else {
          old.push(files);
      }
      done();
  });
  fs.access(filePath, function(err) {
    if (err && err.code === 'ENOENT') {
      createFile(filePath, all.join(''),).then((path) => {}).catch((error) => {
        console.log(`Problem creating bundle.css: ${error.message}`)
      });
    } else{
      fs.readFile(filePath, 'utf8', 
        (err, copies) => {
          if (err) console.log(err);
          else{
            copy = all;
            createFile(filePath, copy.join(''),).then((path) => {}).catch((error) => {
              console.log(`Problem creating bundle.css: ${error.message}`)
            });
          }
          done();
      });
    }
  });
}

pushdata2(function () {
 
}); 
