const path = require("path");
const scanDir = require("../lib/scanDir");
const sendMessage = require("./sendMessage");

// Path where the commands are
const commandsPath = path.join(__dirname, "..", "commands");

// Define triggers for responses
const triggers = scanDir(".js", commandsPath);

// Execute commands
module.exports = (event, pageAccessToken) => {
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
  const args = messageText.split(" ").slice(1).join(" ") || "";

  global.sendMessage = (message) => {
    if (typeof(message) === "object") {
      sendMessage(senderId, message, pageAccessToken);
    } else if (typeof(message) === "string") {
      sendMessage(senderId, { text: message }, pageAccessToken);
    }
  }

  if (messageText[0] === global.config.PREFIX) {
    if (triggers.includes(commandName)) {
      try {
        const commandPath = path.join(commandsPath, triggers[triggers.indexOf(commandName)]);
        const command = require(commandPath);
        if (command.execute) {
          command.execute(args);
        } else {
          return sendMessage(senderId, { text: "Execute Function is not defined!" }, pageAccessToken);
        }
      } catch (err) {
        sendMessage(senderId, { text: "An error occurred while executing the command!" }, pageAccessToken);
        return console.error(err);
      }
    }
  }
};