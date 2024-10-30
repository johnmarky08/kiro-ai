const commandName = 'neko';
const version = '1.5.6';
const permission = 0;
const description = 'Random Nekooo 😻';
const author = 'John Marky Dev';

const execute = async ({ userMessage, messenger }) => {
  try {
    const axios = require('axios');

    const neko = (await axios.get('https://nekos.best/api/v2/neko')).data.results[0];
    const imageUrl = (await axios.get('https://muichiro-api.vercel.app/imgur?api_key=muichiro&link=' + neko.url)).data.result;

    const attachment = {
      attachment: {
        type: 'image',
        payload: {
          url: imageUrl,
        },
      }
    };

    await messenger.send(attachment);
    const messageButtons = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `RANDOM NEKO ANIME PIC\n\n» Artist: ${neko.artist_name} «`,
          buttons: [
            {
              type: 'web_url',
              title: 'View Artist',
              url: neko.artist_href
            },
            {
              type: 'web_url',
              title: 'View Art',
              url: neko.source_url
            }
          ]
        }
      }
    };
    await messenger.send(messageButtons);

  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send({ text: 'An error occurred while processing your request.' });
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