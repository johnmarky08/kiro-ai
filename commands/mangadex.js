const commandName = 'mangadex';
const version = '2.3.1';
const permission = 0;
const description = 'Get manga info via MangaDex';
const author = 'John Marky Dev';

const execute = async ({ userMessage, messenger }) => {
  try {
    if (!userMessage) return await messenger.send(global.language('commands', 'noText'));
    
    const axios = require('axios');
    const response = await axios.get(`https://muichiro-api.vercel.app/mangadex?&api_key=muichiro&search=${encodeURIComponent(userMessage)}`);
    const data = response.data.result;
    const firstLetterUpperCase = (word) => word[0].toUpperCase() + word.slice(1);

    const attachment = {
      attachment: {
        type: 'image',
        payload: {
          url: data.cover,
        },
      }
    };
    
    const text = `MANGADEX INFO\n\nTitle: ${data.title}\nType: ${firstLetterUpperCase(data.type)}\nStatus: ${firstLetterUpperCase(data.status)}\nYear: ${data.year}\nCreator: ${data.creator ? data.creator : 'Unknown'}\nAuthors: ${data.authors.join(', ')}\nArtists: ${data.artists.join(', ')}\n\nGenres: ${data.tags.genres.join(', ')}\n\nThemes: ${data.tags.themes.join(', ')}\n\nFormats: ${data.tags.formats.join(', ')}`;

    const messageButtons = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons: [
            {
              type: 'web_url',
              title: 'View Manga',
              url: data.tapas
            }
          ]
        }
      }
    };
    await messenger.send(messageButtons);
    
    if ((data.description > 0) && (data.description <= 2000)) await messenger.send(`Synopsis:\n\n${data.description}`);
    else await messenger.send("Synopsis is too long or undefined.")
    
    await messenger.send(attachment);
    
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