const commandName = 'owner';
const version = '1.0.0';
const permission = 0;
const description = 'Bot Owner';
const author = 'John Marky Dev';
const payload = 'OWNER_COMMAND';

const execute = async ({ userMessage, messenger }) => {
  try {
    const owner = await messenger.userProfile('8602548189858523');
    const messageData = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              image_url: owner.profile_pic,
              title: `${owner.first_name} Senpai`,
              subtitle: `Owner of ${global.config.botName} AI`,
              buttons: [
                {
                  type: 'web_url',
                  url: 'https://facebook.com/johnmarky.natividad',
                  title: 'View Facebook',
                  webview_height_ratio: 'full',
                },
              ],
            }
          ],
        }
      },
    };
    return await messenger.send(messageData);
  }
  catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send('An error occurred while processing your request.');
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