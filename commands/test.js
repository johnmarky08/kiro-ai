const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async (args, messenger) => {
  try {
    await messenger.sendMessage(`Success: ${args}`);

    const imageUrl = `https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const attachment = {
      type: "image",
      payload: {
        url: imageUrl,
        is_reusable: true
      }
    };
    
    console.log(imageUrl);
    console.log(JSON.stringify(attachment));
    await messenger.sendMessage({
      text: "Here is your image:",
      attachment
    });
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