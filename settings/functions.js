const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

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

const persistentMenu = async (pageAccessToken, event) => {
  try {
    const commandsPayload = [];
    for (let command of global.commandsList) {
      const commandData = require(path.join(__dirname, '..', 'commands', `${command}.js`));

      commandsPayload.push({
        type: 'postback',
        title: `${global.config.prefix}${command}`,
        description: command.description,
        payload: commandData.payload
      });
    }

    const menuData = {
      psid: event.sender.id,
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: false,
          call_to_actions: commandsPayload
      }
    ]
    };

    const options = {
      url: 'https://graph.facebook.com/v21.0/me/custom_user_settings',
      method: 'POST',
      data: menuData,
      params: {
        access_token: pageAccessToken,
      }
    };

    await axios(options);
    return console.log('Persistent Menu Loaded Successfully!');
  } catch (error) {
    return console.log('Persistent Menu Error:', error);
  }
}

const getStarted = async (pageAccessToken) => {
  await axios.post(`https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${pageAccessToken}`, {
    get_started: { payload: 'HELP_COMMAND' }
  });
  console.log('Get Started Button Loaded Successfully..');
}
module.exports = {
  language,
  scanDirectory,
  runCommand,
  persistentMenu,
  getStarted
};