const path = require("path");
const scanDir = require("../lib/scanDir");
const sendMessage = require("./sendMessage");

// Path where the commands are stored
const commandsPath = path.join(__dirname, "..", "commands");

// Define triggers for commands (scanning the .js files in the commands folder)
const triggers = scanDir(".js", commandsPath);

// Main function to handle incoming events
module.exports = async (event, pageAccessToken) => {
  const senderId = event.sender.id; // Get the senderId from the event
  const messageText = event.message.text;

  console.log("Received event:", event); // Log the incoming event

  // Define global sendMessage function
  global.sendMessage = async (message) => {
    try {
      console.log("Attempting to send message:", message); // Log the message to be sent
      if (typeof message === "object") {
        // If the message is an object, send it with senderId and pageAccessToken
        await sendMessage(senderId, message, pageAccessToken);
      } else if (typeof message === "string") {
        // If the message is a string, wrap it in an object
        await sendMessage(senderId, { text: message }, pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Check if the message contains text and is valid
  if (!messageText || typeof messageText !== 'string') {
    console.log("No valid text message received.");
    return await global.sendMessage("I only process text messages!");
  }

  // Extract the command and arguments
  const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
  const args = messageText.split(" ").slice(1).join(" ") || "";

  // Ensure the message starts with the correct prefix
  if (messageText[0] === global.config.PREFIX) {
    if (triggers.includes(`${commandName}.js`)) {
      try {
        console.log("Executing command:", commandName); // Log the command being executed

        // Dynamically require the command file
        const commandPath = path.join(commandsPath, `${commandName}.js`);
        const command = require(commandPath);

        if (typeof command.execute === "function") {
          await command.execute(args); // Call the command's execute function
        } else {
          console.error(`Execute function not defined for command: ${commandName}`);
          await global.sendMessage("Execute function is not defined!");
        }
      } catch (err) {
        await global.sendMessage("An error occurred while executing the command.");
        console.error("Command execution error:", err); // Log the error for debugging
      }
    } else {
      console.log(`Command not found: ${commandName}`); // Log if command doesn't exist
      await global.sendMessage(`Command '${commandName}' not found.`);
    }
  } else {
    console.log("Message did not start with the correct prefix.");
  }
};
