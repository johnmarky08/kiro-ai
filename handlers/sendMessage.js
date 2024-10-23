const request = require("request");

module.exports = async (senderId, message, pageAccessToken) => {
  return new Promise((resolve, reject) => {
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
        return reject(error);
      } else if (body.error) {
        console.error('Error response:', body.error);
        return reject(body.error);
      } else {
        console.log('Message sent successfully:', body);
        return resolve(body);
      }
    });
  });
}