var marked = require('marked'),
    hlb    = require('handlebars'),
    fs     = require('fs'),
    mkdirp = require('mkdirp');

var source = fs.readFileSync('./template.html').toString(),
    template = hlb.compile(source);

function main() {
  parseDir('src');
}

function parseDir(dirName) {
  fs.readdir(dirName, function(err, data) {
    if (err) {
      throw err;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      var fileName = [dirName, data[i]].join('/'),
          stat     = fs.statSync(fileName);

        if (stat.isDirectory()) {
          var distDir = fileName.replace(/^src/, 'dist');
          console.log(' DIR ' + distDir);
          mkdirp.sync(distDir);
          parseDir(fileName);
        } else if (fileName.match(/\.md$/)) {
          parseFile(fileName);
        }

    }
  });
}

function parseFile(fileName) {
  fs.readFile(fileName, function(err, data) {
    if (err) {
      throw err;
    }

    var source  = data.toString(),
        html    = marked(source),
        context = {body: html},
        output  = template(context),
        outFile = fileName.replace(/^src/, 'dist').replace(/md$/, 'html');

    console.log('HTML ' + outFile);

    fs.writeFileSync(outFile, output);
  });
}

main();
