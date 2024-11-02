const commandName = 'anime';
const version = '1.0.0';
const permission = 0;
const description = 'Random Anime Pictures';
const author = 'John Marky Dev';
const payload = 'ANIME_COMMAND';

const execute = async ({ userMessage, messenger }) => {
  try {
    const axios = require('axios');
    const baseUrl = 'https://api.waifu.pics/';
    const sfwTags = [
      'waifu',
      'neko',
      'shinobu',
      'megumin',
      'bully',
      'cuddle',
      'cry',
      'hug',
      'awoo',
      'kiss',
      'lick',
      'pat',
      'smug',
      'bonk',
      'yeet',
      'blush',
      'smile',
      'wave',
      'highfive',
      'handhold',
      'nom',
      'bite',
      'glomp',
      'slap',
      'kill',
      'kick',
      'happy',
      'wink',
      'poke',
      'dance',
      'cringe'
    ];
    const nswfTags = [
      'waifu',
      'neko',
      'trap',
      'blowjob'
    ];
    var imageUrl = '';
    if (!userMessage) {
      imageUrl = (await axios.get(baseUrl + 'sfw/waifu')).data.url;
    } else if (!userMessage.includes('*') && userMessage == 'list') {
      return await messenger.send(`SFW TAGS\n\n${sfwTags.join(', ')}`);
    } else if (!userMessage.includes('*') && sfwTags.includes(userMessage)) {
      imageUrl = (await axios.get(baseUrl + 'sfw/' + userMessage)).data.url;
    } else if (userMessage.includes('*') && userMessage.replace('*', '') == 'list') {
      return await messenger.send(`NSFW TAGS\n\n${nswfTags.join(', ')}`);
    } else if (userMessage.includes('*') && nswfTags.includes(userMessage.replace('*', ''))) {

      imageUrl = (await axios.get(baseUrl + 'nsfw/' + userMessage.replace('*', ''))).data.url;
    } else {
      return await messenger.send('The tags you\'ve given is invalid!');
    }
    const attachment = {
      type: 'image',
      payload: {
        url: imageUrl,
        is_reusable: true,
      },
    };
    return await messenger.send({ attachment });
  } catch (error) {
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
  payload
};