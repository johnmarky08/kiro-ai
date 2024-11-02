const path = require("path");
const Messenger = require('../model/messenger');
const { runCommand } = require('../settings/functions');

module.exports = async (event, pageAccessToken) => {
  const messenger = new Messenger(event, pageAccessToken);
  const payload = event.postback.payload;

  try {
    for (let command in global.commandsList) {
      var commandPayload = require(path.join(__dirname, '..', 'commands', `${command}.js`)).payload;
      if (payload == commandPayload) {
        return await runCommand(command, messenger);
      } else {
        return await messenger.send('Postback not found!');
      }
    }
  } catch (error) {
    return await messenger.send('Postback Error: ' + error);
  }
};