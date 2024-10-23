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

  console.log("Received event:", event); // Log the incoming event

  if (!messageText || typeof messageText !== 'string') {
    console.log("No text message received.");
    return global.sendMessage({ text: "I only process text messages!" });
  }

  const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
  const args = messageText.split(" ").slice(1).join(" ") || "";

  // Define global sendMessage function
  global.sendMessage = (message) => {
    try {
      console.log("Attempting to send message:", message); // Log the message to be sent
      if (typeof message === "object") {
        sendMessage(senderId, message, pageAccessToken);
      } else if (typeof message === "string") {
        sendMessage(senderId, { text: message }, pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };


  // Ensure the message starts with the correct prefix
  if (messageText[0] === global.config.PREFIX) {
    if (triggers.includes(`${commandName}.js`)) {
      try {
        console.log("Executing command:", commandName); // Log the command being executed
        const commandPath = path.join(commandsPath, `${commandName}.js`);
        const command = require(commandPath);

        if (typeof command.execute === "function") {
          command.execute(args); // Execute the command with arguments
        } else {
          global.sendMessage({ text: "Execute function is not defined!" });
        }
      } catch (err) {
        global.sendMessage({ text: "An error occurred while executing the command!" });
        console.error("Command Execution Error:", err); // Log the error
      }
    } else {
      console.log("Command not found:", commandName); // Log if command doesn't exist
    }
  } else {
    console.log("Message did not start with the correct prefix.");
  }
};