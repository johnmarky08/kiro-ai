const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    await messenger.sendMessage(`Success: ${args}`);

    const imageUrl = (await messenger.userProfile(args)).profile_pic;

    const attachment = {
      type: "image",
      payload: {
        url: imageUrl,
        is_reusable: true
      }
    };

    await messenger.sendMessage(`Sending with photo`);
    await messenger.sendMessage({ attachment });
    
    
    await messenger.reply(`Replying with photo`);
    await messenger.reply({ attachment });
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