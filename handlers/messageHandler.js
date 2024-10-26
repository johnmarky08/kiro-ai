const path = require("path");
const moment = require("moment-timezone");
const commandsPath = path.join(__dirname, "..", "commands");
const Messenger = require("../model/messenger");

module.exports = async (event, pageAccessToken) => {
  const messageText = event.message.text;

  const messenger = new Messenger(event, pageAccessToken);

  if (messageText[0] === global.config.PREFIX) {
    if (messageText === global.config.PREFIX) {
      var gio = moment.tz("Asia/Manila").format("HH:mm:ss || MM/DD/YYYY");
      return await messenger.send(
        global.langText("settings", "prefix", global.config.PREFIX, gio)
      );
    }

    const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
    const args = messageText.split(" ").slice(1).join(" ") || "";

    if (global.commandsList.includes(commandName)) {
      try {
        const commandPath = path.join(commandsPath, commandName);
        const command = require(commandPath);

        if (typeof command.execute === "function") {
          await command.execute({ args, messenger });
        } else {
          await messenger.send("Execute function is not defined!");
        }
      } catch (err) {
        await messenger.send("An error occurred while executing the command.");
      }
    } else {
      await messenger.send(`Command '${commandName}' not found.`);
    }
  }
};