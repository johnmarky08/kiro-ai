const path = require("path");
const scanDir = require("../lib/scanDir");
const sendMessage = require("./sendMessage");

const commandsPath = path.join(__dirname, "..", "commands");
const triggers = scanDir(".js", commandsPath);

class Messenger {
  constructor(event, pageAccessToken) {
    this.senderID = event.sender.id;
    this.pageAccessToken = pageAccessToken;
    this = event;
  }

  async sendMessage(message) {
    try {
      if (typeof message === "object") {
        return await sendMessage(this.senderID, message, this.pageAccessToken);
      } else if (typeof message === "string") {
        return await sendMessage(this.senderID, { text: message }, this.pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }
}

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
          await messenger.sendMessage("Execute function is not defined!");
        }
      } catch (err) {
        await messenger.sendMessage("An error occurred while executing the command.");
      }
    } else {
      await messenger.sendMessage(`Command '${commandName}' not found.`);
    }
  }
};