const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    if (!args) {
      await messenger.send((await messenger.botProfile()).id);
      return await messenger.send({
        attachment: {
          type: "image",
          payload: {
            url: (await messenger.botProfile()).profile_pic,
            is_reusable: true
          }
        }
      });
    }
    await messenger.send(`Success: ${args}`);

    const imageUrl = (await messenger.userProfile(args)).profile_pic;

    const attachment = {
      type: "image",
      payload: {
        url: imageUrl,
        is_reusable: true
      }
    };

    //NORMAL
    await messenger.send(`Sending with photo`);
    await messenger.send({ attachment });

    //REPLY BUT STILL LOOKS NORMAL
    await messenger.reply(`Replying with photo`);
    await messenger.reply({ attachment });
  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send("An error occurred while processing your request.");
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