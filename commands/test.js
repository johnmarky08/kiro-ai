const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async (args) => {
  try {
    // Log the start of the command execution for debugging
    console.log("Executing 'test' command with args:", args);

    // Send a success message to the user
    await global.sendMessage(`Success: ${args}`);

    // Construct the Facebook Graph API URL for the profile picture
    const imageUrl = `https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // Prepare the attachment
    const attachment = {
      type: "image",
      payload: {
        url: imageUrl, // Use the direct URL from the Facebook Graph API
        is_reusable: true
      }
    };

    console.log("Sending image attachment");

    // Send the message with the image attachment
    await global.sendMessage({
      text: "Here is your image:",
      attachment: attachment
    });

  } catch (error) {
    // Handle errors that might occur during the execution of the command
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
