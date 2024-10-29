const fs = require("fs-extra");
const path = require("path");

const langText = (...args) => {
  try {
    //CREDITS TO MIRAI FOR THIS
    const lang = require(`./lang.json`);
    let result = lang[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
      const regEx = RegExp(`%${i - 1}`, "g");
      result = result.replace(regEx, args[i + 1]);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
};

const scanDir = (type, link) => {
  if (typeof type !== "string" || typeof link !== "string") {
    throw new Error("Both 'type' and 'link' should be strings.");
  }

  let dirfile;
  try {
    dirfile = fs.readdirSync(link);
  } catch (err) {
    throw new Error(`Unable to read directory at ${link}: ${err.message}`);
  }

  const arr = [];

  for (const filename of dirfile) {
    const fullPath = path.join(link, filename);

    try {
      if (fs.lstatSync(fullPath).isFile() && filename.endsWith(type)) {
        arr.push(filename.slice(0, -type.length));
      }
    } catch (err) {
      console.error(`Error checking file ${fullPath}: ${err.message}`);
    }
  }

  return arr;
};

const runCommand = async (commandName, messenger, args) => {
  const commandPath = path.join(commandsPath, commandName);
  const command = require(commandPath);

  if (typeof command.execute === "function") {
    await command.execute({ args, messenger });
  } else {
    await messenger.send("Execute function is not defined!");
  }
}

module.exports = {
  langText,
  scanDir,
  runCommand
};
