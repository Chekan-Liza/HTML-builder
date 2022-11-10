const fs = require("fs");
const path = require("path");
const directoryPath = path.join(__dirname, 'project-dist');
const indexPath = path.join(directoryPath, 'index.html');
const components = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const styles = path.join(directoryPath, 'style.css');
const styleFrom = path.join(__dirname, 'styles');
const link = path.join(__dirname, 'assets');
const copyLink = path.join(directoryPath, 'assets');

//Create empty directory project-dist
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

createDirectory(directoryPath).then((path) => {}).catch((error) => {
  console.log(`Problem creating directory 'project-dist': ${error.message}`)
});

//Create empty file index.html in project-dist
function createFile(filePath, data) {
  const file = path.normalize(filePath);
  return new Promise((resolve, reject) => {
    fs.stat(file, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.writeFile(file, data, (error) => {
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

createFile(indexPath, '').then((path) => {}).catch((error) => {
  console.log(`Problem creating index.html: ${error.message}`)
});

//Read and save template
var tempData = '';

function pushTemplate(done){
  fs.readFile(template, 'utf8', function(error, data){
    if(error) throw error;
    else {
        if(data != null) tempData = data;
      }
    done();  
  });
}
   
pushTemplate(function () {
  fs.readdir(components, 
    {withFileTypes: true},
    (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        if(!file.isDirectory() && path.extname(file.name) === '.html'){
          function replaceTemplate(done){
            fs.readFile(path.join(components, file.name), 'utf8', function(error, data){
              if(error) throw error;
              else {
                tempData = tempData.replace(`{{${file.name.split('.')[0]}}}`, data);
              }
              done();
            });
          }
          //Write template + components > index.html
          replaceTemplate(function () {
            var writer = fs.createWriteStream(indexPath); 
            writer.write(tempData);
          })
        }     
      });
    }
  });
}); 

//Create empty file style.css in project-dist
createFile(styles, '').then((path) => {}).catch((error) => {
  console.log(`Problem creating style.css (0): ${error.message}`)
});

var all = [];
var old = [];
var copy = [];

fs.readdir(styleFrom, 
  { withFileTypes: true },
  (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach(file => {
      if(!file.isDirectory() && path.extname(file.name) === '.css'){
          function pushdata(done){
              fs.readFile(path.join(styleFrom, file.name), 'utf8', function(error, data){
                  if(error) throw error;
                  else {
                      if(data != null) all.push(data);
                  }
                  done();
              });
          }

          pushdata(function () {
            fs.writeFile(styles, all.join(''), (error) => {
              if(error) throw error;
            });
            
            copy = all;
          });
      }     
    });
  }
})

fs.readFile(styles, 'utf8', (err, files) => {
  if(err){
    createFile(styles, all.join(''),).then((path) => {}).catch((error) => {
      console.log(`Problem creating style.css (1): ${error.message}`)
    });
  } else old.push(files);
});

fs.access(styles, function(err) {
  if(err && err.code === 'ENOENT') {
    createFile(styles, all.join(''),).then((path) => {}).catch((error) => {
      console.log(`Problem creating style.css (2): ${error.message}`)
    });
  } else{
    fs.readFile(styles, 'utf8', 
      (err, copies) => {
        if (err) console.log(err);
        else{
          copy = all;
          createFile(styles, copy.join(''),).then((path) => {}).catch((error) => {
            console.log(`Problem creating style.css (3): ${error.message}`)
          });
        }
    });
  }
});

//Create empty assets directory in project-dist
createDirectory(copyLink).then((path) => {}).catch((error) => {
  console.log(`Problem creating assets directory: ${error.message}`)
});

function addAssets(orig, newF) {


  fs.readdir(orig,
    { withFileTypes: true },
    (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
      const oF = path.join(orig, file.name);
      const nF = path.join(newF, file.name);
      if (file.isDirectory()) {
        fs.stat(nF, (err) => {
          if(err) {
            fs.mkdir(nF, (err) => {
              if (err) console.error(err);
            });
            addAssets(oF, nF);
          } else {
            addAssets(oF, nF);
          }
        });
      }
      if (file.isFile()) {
        fs.copyFile(oF, nF,(err) => {
          if (err) console.error(err);
        });
      }
    });
  });
}

addAssets(link, copyLink);
