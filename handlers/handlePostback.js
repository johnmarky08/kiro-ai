module.exports = (event, pageAccessToken) => {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  // Send a message back to the sender
  global.sendMessage(`You sent a postback with payload: ${payload}`);
}