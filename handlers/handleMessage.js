const path = require("path");
const scanDir = require("../lib/scanDir");

// Path where the commands are stored
const commandsPath = path.join(__dirname, "..", "commands");

// Define triggers for commands (scanning the .js files in the commands folder)
const triggers = scanDir(".js", commandsPath);

// Main function to handle incoming events
module.exports = async (event, pageAccessToken) => {
  try {
    const senderId = event.sender.id;
    const messageText = event.message.text;

    // Log the incoming event
    console.log("Received event:", event);

    // Ignore bot's own messages or any unwanted messages
    if (event.message.is_echo) {
      console.log("Ignoring bot's own message or system messages.");
      return;
    }

    // Check if the message contains text and is valid
    if (!messageText || typeof messageText !== 'string') {
      console.log("No valid text message received.");
      return await global.sendMessage({ text: "I only process text messages!" }, pageAccessToken);
    }

    // Extract the command and arguments
    const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
    const args = messageText.split(" ").slice(1).join(" ") || "";

    // Define global sendMessage function
    global.sendMessage = async (message) => {
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
            await global.sendMessage({ text: "Execute function is not defined!" });
          }
        } catch (err) {
          await global.sendMessage({ text: "An error occurred while executing the command." });
          console.error("Command execution error:", err); // Log the error for debugging
        }
      } else {
        console.log(`Command not found: ${commandName}`); // Log if command doesn't exist
        await global.sendMessage({ text: `Command '${commandName}' not found.` });
      }
    } else {
      console.log("Message did not start with the correct prefix.");
    }
  } catch (error) {
    console.error("Error processing event:", error);
  }
};
