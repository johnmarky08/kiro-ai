const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async (args) => {
  try {
    console.log("Executing 'test' command with args:", args);
    await global.sendMessage(`Success ${args}`); // Call with just the message

    const imageUrl = `https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=YOUR_ACCESS_TOKEN`;

    const attachment = {
      type: "image",
      payload: {
        url: imageUrl,
        is_reusable: true
      }
    };

    console.log("Sending image attachment");
    await global.sendMessage({
      text: "Here is your image:",
      attachment: attachment // Call with an object that includes the attachment
    });
  } catch (error) {
    console.error("Error in executing 'test' command:", error);
    await global.sendMessage("An error occurred while processing your request.");
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
