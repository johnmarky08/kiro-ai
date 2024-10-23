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

  if (!messageText || typeof messageText !== 'string') {
    return global.sendMessage({ text: "I only process text messages!" });
  }

  const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
  const args = messageText.split(" ").slice(1).join(" ") || "";

  // Define global sendMessage function
  global.sendMessage = (message) => {
    if (typeof message === "object") {
      sendMessage(senderId, message, pageAccessToken);
    } else if (typeof message === "string") {
      sendMessage(senderId, { text: message }, pageAccessToken);
    }
  };

  // Ensure the message starts with the correct prefix
  if (messageText[0] === global.config.PREFIX) {
    if (triggers.includes(commandName)) {
      try {
        const commandPath = path.join(commandsPath, triggers[triggers.indexOf(commandName)]);
        const command = require(commandPath);

        if (typeof command.execute === "function") {
          command.execute(args); // Execute the command with arguments
        } else {
          global.sendMessage({ text: "Execute function is not defined!" });
        }
      } catch (err) {
        global.sendMessage({ text: "An error occurred while executing the command!" });
        console.error("Command Execution Error:", err);
      }
    }
  }
};