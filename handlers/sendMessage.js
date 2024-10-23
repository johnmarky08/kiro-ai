const axios = require("axios");

module.exports = async (senderId, message, pageAccessToken) => {
  try {
    const options = {
      url: 'https://graph.facebook.com/v21.0/me/messages',
      method: 'POST',
      data: {
        recipient: { id: senderId },
        message: message,
      },
      params: { access_token: pageAccessToken }
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
    throw new Error('Failed to send message.');
  }
};
