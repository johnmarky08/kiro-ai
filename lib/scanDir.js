const fs = require("fs-extra");
const path = require("path");

function scanDir(type, link) {
  //readDir
  var dirfile = fs.readdirSync(link);
  var arr = [];
  for (var i = 0; i < dirfile.length; i++) {
    let fileName = dirfile[i].length - type.length;
    if (dirfile[i].lastIndexOf(type) == fileName) {
      if (fs.lstatSync(path.join(link, dirfile[i])).isFile()) {
        arr.push(fileName);
      }
    }
  }
  return arr;
}

module.exports = scanDir;