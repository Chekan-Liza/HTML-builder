const fs = require('fs');
const path = require('path');

let link = path.join(__dirname, 'secret-folder');

fs.readdir(link, 
    { withFileTypes: true },
    (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if(!file.isDirectory()){
           let fileStr = '';

           let arr = file.name.split('.');
           let ext = path.extname(file.name).slice(1);

            fs.stat(
                path.join(link, file.name),
                (error, stats) => {
                if (error) {
                    console.log(error);
                }
                else {
                    fileStr += Number(stats.size/1024).toFixed(3) + 'kb';

                    console.log(fileStr);
                }
              });

            fileStr += arr[0] + ' - ' + ext + ' - '; 
        }
      })
    }
})
