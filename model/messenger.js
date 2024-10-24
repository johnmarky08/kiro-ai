const axios = require('axios');
const { send, reply } = require("../handlers/sendMessage");

class Messenger {
  constructor(event, pageAccessToken) {
    this.senderID = event.sender.id;
    this.messageID = event.message.mid || undefined;
    this.pageAccessToken = pageAccessToken;
    this.event = event;
  }

  async send(message) {
    try {
      if (typeof message === "object") {
        return await send(this.senderID, message, this.pageAccessToken);
      } else if (typeof message === "string") {
        return await send(this.senderID, { text: message }, this.pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  async reply(message) {
    try {
      if (typeof message === "object") {
        return await reply(this.senderID, message, this.messageID, this.pageAccessToken);
      } else if (typeof message === "string") {
        return await reply(this.senderID, { text: message }, this.messageID, this.pageAccessToken);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  async userProfile(userID) {
    try {
      const response = await axios.get(`https://graph.facebook.com/v21.0/${userID}`, {
        params: {
          access_token: this.pageAccessToken,
          fields: 'id,first_name,name,profile_pic,birthday,email,gender,link,location',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sender profile:", error);
      throw error;
    }
  }

  async botProfile() {
    try {
      const response = await axios.get(`https://graph.facebook.com/v21.0/me`, {
        params: {
          access_token: this.pageAccessToken,
          fields: 'id,name,about,picture,current_location,emails,followers_count,cover,fan_count,website',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bot profile:", error);
      throw error;
    }
  }
}

module.exports = Messenger;