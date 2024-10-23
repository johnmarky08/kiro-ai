const axios = require("axios");

const MAX_RETRIES = 3;

const sendMessageWithRetries = async (options, retries = MAX_RETRIES) => {
  try {
    const response = await axios(options);
    console.log('Message sent successfully:', response.data);
    return response.data; 
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... Attempts left: ${retries}`);
      return await sendMessageWithRetries(options, retries - 1);
    }
    if (error.response) {
      console.error('Error response:', error.response.data.error);
      throw error.response.data.error; 
    } else {
      console.error('Error sending message:', error.message);
      throw error; 
    }
  }
};

module.exports = async (senderId, message, pageAccessToken) => {
  const options = {
    method: 'POST',
    url: 'https://graph.facebook.com/v21.0/me/messages',
    params: { access_token: pageAccessToken },
    data: {
      recipient: { id: senderId },
      message: message,
    },
    timeout: 5000,
  };

  return sendMessageWithRetries(options);
};
