const fs = require('fs-extra');
const path = require('path');

const language = (...identifiers) => {
  try {
    // Credits To Mirai For This
    const language = require(`./language.json`);
    let result = language[identifiers[0]][identifiers[1]];
    for (var i = identifiers.length - 1; i > 0; i--) {
      const regEx = RegExp(`%${i - 1}`, 'g');
      result = result.replace(regEx, identifiers[i + 1]);
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

  switch (command.permission) {
    case 1: {
      if (!global.config.administrator.includes(messenger.senderId)) {
        return await messenger.send(global.language('settings', 'administratorOnly'));
      }
      else break;
    }
    case 2: {
      return await messenger.send(global.language('settings', 'maintenance'));
    }
  }

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