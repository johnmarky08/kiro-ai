const axios = require("axios");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (senderId, message, pageAccessToken) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const options = {
        url: 'https://graph.facebook.com/v21.0/me/messages',
        method: 'POST',
        data: {
          recipient: { id: senderId },
          message: message,
        },
        params: { access_token: pageAccessToken },
        timeout: 5000,
      };

      const response = await axios(options);
      console.log('Message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data.error);
      } else {
        console.error('Error sending message:', error.message);
      }

      attempt += 1;
      if (attempt < maxRetries) {
        const backoffTime = Math.pow(2, attempt) * 100;
        console.log(`Retrying in ${backoffTime} ms...`);
        await sleep(backoffTime);
      } else {
        throw new Error('Max retries reached. Failed to send message.');
      }
    }
  }
};
