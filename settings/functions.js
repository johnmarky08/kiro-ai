const fs = require("fs-extra");
const path = require("path");


const langText = (...args) => {
  try {
    //CREDITS TO MIRAI FOR THIS
    const lang = require(`./lang.json`);
    let result = lang[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
      const regEx = RegExp(`%${i - 1}`, 'g');
      result = result.replace(regEx, args[i + 1]);
    }
    return result;
  } catch (e) {
    console.error(e)
  }
}

const scanDir = (type, link) => {
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
      arr.push(dirfile[i].slice(0, -type.length));
    }
  }

  return arr;
}

module.exports = {
  langText,
  scanDir
}