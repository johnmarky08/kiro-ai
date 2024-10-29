const Messenger = require("../model/messenger");
const { runCommand } = require("../settings/functions");

module.exports = async (event, pageAccessToken) => {
  const messenger = new Messenger(event, pageAccessToken);
  const payload = event.postback.payload;

  if (payload == "HELP_COMMAND") {
    await runCommand("help", messenger);
  }
};