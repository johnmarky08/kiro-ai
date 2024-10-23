const path = require("path");
const scanDir = require("../lib/scanDir");
const sendMessage = require("./sendMessage");

// Path where the commands are stored
const commandsPath = path.join(__dirname, "..", "commands");

// Define triggers for commands (scanning the .js files in the commands folder)
const triggers = scanDir(".js", commandsPath);

// Define global sendMessage function
global.sendMessage = async (senderId, message, pageAccessToken) => {
  try {
    console.log("Attempting to send message:", message); // Log the message to be sent
    if (typeof message === "object") {
      await sendMessage(senderId, message, pageAccessToken);
    } else if (typeof message === "string") {
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

// Main function to handle incoming events
module.exports = async (event, pageAccessToken) => {
  try {
    const senderId = event.sender.id;
    const messageText = event.message.text;

    console.log("Received event:", event); // Log the incoming event

    // Check if the message contains text and is valid
    if (!messageText || typeof messageText !== 'string') {
      console.log("No valid text message received.");
      return await global.sendMessage(senderId, { text: "I only process text messages!" }, pageAccessToken);
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
            await command.execute(args); // Await the command execution
          } else {
            console.error(`Execute function not defined for command: ${commandName}`);
            await global.sendMessage(senderId, { text: "Execute function is not defined!" }, pageAccessToken);
          }
        } catch (err) {
          await global.sendMessage(senderId, { text: "An error occurred while executing the command." }, pageAccessToken);
          console.error("Command execution error:", err); // Log the error for debugging
        }
      } else {
        console.log(`Command not found: ${commandName}`); // Log if command doesn't exist
        await global.sendMessage(senderId, { text: `Command '${commandName}' not found.` }, pageAccessToken);
      }
    } else {
      console.log("Message did not start with the correct prefix.");
    }
  } catch (error) {
    console.error("Error processing event:", error);
    // Optionally send an error message to the user
  }
};