const axios = require('axios');
const { send } = require('../handlers/sendMessage');

class Messenger {
  constructor(event, pageAccessToken) {
    this.senderId = event.sender.id;
    this.pageAccessToken = pageAccessToken;
    this.event = event;
  }

  async send(message) {
    try {
      if (typeof message === 'object') {
        return await send(this.senderId, message, this.pageAccessToken);
      } else if (typeof message === 'string') {
        return await send(
          this.senderId, { text: message },
          this.pageAccessToken
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async sendImages(images, title) {
    try {
      const elements = images.map((url) => ({
        image_url: url,
        buttons: [
          {
            type: 'web_url',
            url,
            title,
            webview_height_ratio: 'full',
          }
        ]
      }));
      const messageData = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements,
          },
        },
      };

      return await send(this.senderId, messageData, this.pageAccessToken);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async userProfile(userID) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v21.0/${userID}`,
        {
          params: {
            access_token: this.pageAccessToken,
            fields: 'id,first_name,name,profile_pic,birthday,email,gender,link,location',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sender profile:', error);
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
      console.error('Failed to fetch bot profile:', error);
      throw error;
    }
  }
}

module.exports = Messenger;