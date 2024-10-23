const fs = require("fs-extra");
const path = require("path");

function scanDir(type, link) {
  // Validate input
  if (typeof type !== 'string' || typeof link !== 'string') {
    throw new Error("Both 'type' and 'link' should be strings.");
  }

  // Read the directory
  let dirfile;
  try {
    dirfile = fs.readdirSync(link);
  } catch (err) {
    throw new Error(`Unable to read directory: ${err.message}`);
  }

  const arr = [];

  for (let i = 0; i < dirfile.length; i++) {
    const fullPath = path.join(link, dirfile[i]);
    if (fs.lstatSync(fullPath).isFile() && dirfile[i].endsWith(type)) {
      arr.push(dirfile[i]);
    }
  }

  return arr;
}

module.exports = scanDir;