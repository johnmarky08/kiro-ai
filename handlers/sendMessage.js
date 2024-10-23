const request = require("request");

module.exports = (senderId, message, pageAccessToken) => {
  request({
    url: 'https://graph.facebook.com/v21.0/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      message: message,
    },
  }, (error, response, body) => {
    if (error) {
      console.error('Error sending message:', error);
    } else if (response.body.error) {
      console.error('Error response:', response.body.error);
    } else {
      console.log('Message sent successfully:', body);
    }
  });
}