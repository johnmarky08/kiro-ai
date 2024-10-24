const Messenger = require("../model/messenger");

module.exports = async (event, pageAccessToken) => {
  const messenger = new Messenger(event, pageAccessToken);
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  // Send a message back to the sender
  await messenger.send(`You sent a postback with payload: ${payload}`);
}