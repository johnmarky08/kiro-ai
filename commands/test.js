const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async (args, messenger) => {
  try {
    await messenger.sendMessage(`Success: ${args}`);

    const imageUrl = `https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=YOUR_ACCESS_TOKEN`;

    const attachment = {
      type: "image",
      payload: {
        url: imageUrl,
        is_reusable: true
      }
    };

    await messenger.sendMessage({
      text: "Here is your image:",
      attachment: attachment
    });
  } catch (error) {
    console.error("Error in executing 'test' command:", error);
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