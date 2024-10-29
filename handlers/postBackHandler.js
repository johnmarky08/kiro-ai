const Messenger = require("../model/messenger");
const { runCommand } = require("../settings/functions");

module.exports = async (event, pageAccessToken) => {
  const messenger = new Messenger(event, pageAccessToken);
  const payload = event.postback.payload;
  const commands = {
    "HELP_COMMAND": "help"
  };
  
  try {
  if (commands[payload]) {
    return await runCommand(commands[payload], messenger);
  } else {
    return await messenger.send("Postback not found!");
  }
  } catch (e) {
    return await messenger.send("Postback Error: " + e);
  }
};