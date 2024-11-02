const commandName = 'gemini';
const version = '1.0.0';
const permission = 0;
const description = 'Ask questions with Gamini AI';
const author = 'John Marky Dev';
const payload = 'GEMINI_COMMAND';
const usage = 'Text';

const execute = async ({ userMessage, messenger }) => {
  try {
    if (!userMessage) return await messenger.send(global.language('commands', 'noText'));

    const axios = require('axios');
    const response = await axios.get(`https://muichiro-api.vercel.app/gemini?&api_key=muichiro&text=${encodeURIComponent(userMessage)}`);
    const data = response.data.response;
    
      if ((data.length <= 2000)) return await messenger.send(data);
      else return await messenger.send('Message is too long.');
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
  payload,
  usage
};