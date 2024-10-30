const fs = require('fs-extra');
const path = require('path');

const language = (...userMessage) => {
  try {
    // Credits To Mirai For This
    const language = require(`./language.json`);
    let result = language[userMessage[0]][userMessage[1]];
    for (var i = userMessage.length - 1; i > 0; i--) {
      const regEx = RegExp(`%${i - 1}`, 'g');
      result = result.replace(regEx, userMessage[i + 1]);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

const scanDirectory = (type, link) => {
  if (typeof type !== 'string' || typeof link !== 'string') {
    throw new Error('Both \'type\' and \'link\' should be strings.');
  }

  let directoryFile;
  try {
    directoryFile = fs.readdirSync(link);
  } catch (error) {
    throw new Error(`Unable to read directory at ${link}: ${error.message}`);
  }

  const arr = [];

  for (const fileName of directoryFile) {
    const fullPath = path.join(link, fileName);

    try {
      if (fs.lstatSync(fullPath).isFile() && fileName.endsWith(type)) {
        arr.push(fileName.slice(0, -type.length));
      }
    } catch (error) {
      console.error(`Error checking file ${fullPath}: ${error.message}`);
    }
  }

  return arr;
};

const runCommand = async (commandName, messenger, userMessage) => {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandPath = path.join(commandsPath, commandName);
  const command = require(commandPath);

  if (typeof command.execute === 'function') {
    await command.execute({ userMessage, messenger });
  } else {
    await messenger.send('Execute function is not defined!');
  }
}

module.exports = {
  language,
  scanDirectory,
  runCommand
};