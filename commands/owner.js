const commandName = "owner";
const version = "1.0.0";
const permission = 0;
const description = "Bot Owner";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const owner = await messenger.userProfile("8602548189858523");
    const messageData = {
      recipient: { id: senderID },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "media",
            elements: [
              {
                media_type: "image",
                attachment_id: null,
                url: owner.profile_pic,
                buttons: [
                  {
                    type: "web_url",
                    url: "https://facebook.com/johnmarky.natividad",
                    title: owner.name,
                    webview_height_ratio: "full",
                  },
                ],
                subtitle: `Owner of ${global.config.BOTNAME} AI`,
              },
            ],
          },
        },
      },
    };
    return await messenger.send(messageData);
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
  execute,
};