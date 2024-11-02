const path = require('path');
const moment = require('moment-timezone');
const similar = require('string-similarity');
const { runCommand } = require('../settings/functions');
const { screenshot } = require('../settings/autoCommands');
const Messenger = require('../model/messenger');

module.exports = async (event, pageAccessToken) => {
  const messageText = event.message.text;
  const userMessage = messageText.split(' ').slice(1).join(' ') || '';
  const messenger = new Messenger(event, pageAccessToken);

  if (messageText[0] === global.config.prefix) {
    if (messageText === global.config.prefix) {
      var currentTime = moment.tz('Asia/Manila').format('hh:mm:ss A || MM/DD/YYYY');
      return await messenger.send(
        helpPostBack(global.language('settings', 'prefix', global.config.prefix, currentTime))
      );
    }

    const commandName = messageText.split(' ')[0].slice(1).toLowerCase();
    var best = similar.findBestMatch(commandName, global.commandsList);

    if (best.bestMatch.rating > 0.5) {
      try {
        return await runCommand(global.commandsList[best.bestMatchIndex], messenger, userMessage);
      } catch (error) {
        return await messenger.send('An error occurred while executing the command.');
      }
    } else {
      return await messenger.send(
        helpPostBack(global.language('settings', 'wrongCommand', global.config.prefix))
      );
    }
  } else {
    if (userMessage.includes('https://')) return screenshot(userMessage, messenger);
  }
};

const helpPostBack = (message) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: message,
        buttons: [
          {
            type: 'postback',
            title: `${global.config.prefix}help`,
            payload: 'HELP_COMMAND'
            }
          ]
      }
    }
  }
}