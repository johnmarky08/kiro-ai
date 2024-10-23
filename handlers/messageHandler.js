const path = require("path");
const scanDir = require("../lib/scanDir");
const sendMessage = require("./sendMessage");

const commandsPath = path.join(__dirname, "..", "commands");
const triggers = scanDir(".js", commandsPath);

class Messenger {
  constructor(senderId, pageAccessToken) {
    this.senderId = senderId;
    this.pageAccessToken = pageAccessToken;
  }

  async sendMessage(message) {
    try {
      if (typeof message === "object") {
        return await sendMessage(this.senderId, message, this.pageAccessToken);
      } else if (typeof message === "string") {
        return await sendMessage(this.senderId, { text: message }, this.pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
}

module.exports = async (event, pageAccessToken) => {
  const senderId = event.sender.id;
  const messageText = event.message.text;

  const messenger = new Messenger(senderId, pageAccessToken);

  if (!messageText || typeof messageText !== 'string') {
    return await messenger.sendMessage("I only process text messages!");
  }

  const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
  const args = messageText.split(" ").slice(1).join(" ") || "";

  if (messageText[0] === global.config.PREFIX) {
    if (triggers.includes(`${commandName}.js`)) {
      try {
        const commandPath = path.join(commandsPath, `${commandName}.js`);
        const command = require(commandPath);

        if (typeof command.execute === "function") {
          await command.execute(args, messenger);
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