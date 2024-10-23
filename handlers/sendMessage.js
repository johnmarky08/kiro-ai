const axios = require("axios");

module.exports = async (senderId, message, pageAccessToken) => {
  const options = {
    method: 'POST',
    url: 'https://graph.facebook.com/v21.0/me/messages',
    params: { access_token: pageAccessToken },
    data: {
      recipient: { id: senderId },
      message: message,
    },
  };

  try {
    const response = await axios(options);
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data.error);
      throw error.response.data.error;
    } else {
      console.error('Error sending message:', error.message);
      throw error;
    }
  }
};