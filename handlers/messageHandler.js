const path = require("path");
const scanDir = require("../lib/scanDir");
const commandsPath = path.join(__dirname, "..", "commands");
const triggers = scanDir(".js", commandsPath);
const Messenger = require("../model/messenger");


module.exports = async (event, pageAccessToken) => {
  const messageText = event.message.text;

  const messenger = new Messenger(event, pageAccessToken);

  if (messageText[0] === global.config.PREFIX) {
    const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
    const args = messageText.split(" ").slice(1).join(" ") || "";

    if (triggers.includes(`${commandName}.js`)) {
      try {
        const commandPath = path.join(commandsPath, `${commandName}.js`);
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