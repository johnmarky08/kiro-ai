module.exports = class Messenger {
  constructor(event, pageAccessToken) {
    this.senderID = event.sender.id;
    this.pageAccessToken = pageAccessToken;
    this.event = event;
  }

  async sendMessage(message) {
    try {
      if (typeof message === "object") {
        return await sendMessage(this.senderID, message, this.pageAccessToken);
      } else if (typeof message === "string") {
        return await sendMessage(this.senderID, { text: message }, this.pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  async senderProfile(userID) {
    try {
      const response = await axios.get(`https://graph.facebook.com/v21.0/${userID}`, {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'id,first_name,last_name,profile_pic',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Could not fetch user profile: ' + error.message);
    }
  }
}