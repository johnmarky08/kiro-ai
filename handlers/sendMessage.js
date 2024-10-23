const axios = require("axios");

module.exports = async (senderId, message, pageAccessToken) => {
  const maxRetries = 3; // Set the maximum number of retries
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
        timeout: 5000, // Set timeout to 5 seconds
      };

      const response = await axios(options);
      console.log('Message sent successfully:', response.data);
      return response.data; // Resolve with the response data
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data.error);
      } else {
        console.error('Error sending message:', error.message);
      }

      attempt += 1; // Increment the retry count
      if (attempt < maxRetries) {
        console.log(`Retrying... (${attempt}/${maxRetries})`);
      } else {
        throw new Error('Max retries reached. Failed to send message.');
      }
    }
  }
};
