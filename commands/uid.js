const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    if (!args) {
      await messenger.sendMessage(messenger.event.sender.id);
      return await messenger.sendMessage("Not event: " + messenger.senderID);
    }
  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.sendMessage("An error occurred while processing your request.");
  }
};


module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute
};