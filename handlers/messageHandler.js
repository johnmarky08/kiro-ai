const path = require("path");
const moment = require("moment-timezone");
const similar = require("string-similarity");
const commandsPath = path.join(__dirname, "..", "commands");
const { runCommand } = require("../settings/functions");
const Messenger = require("../model/messenger");

module.exports = async (event, pageAccessToken) => {
  const messageText = event.message.text;
  const args = messageText.split(" ").slice(1).join(" ") || "";
  const messenger = new Messenger(event, pageAccessToken);

  if (messageText[0] === global.config.PREFIX) {
    if (messageText === global.config.PREFIX) {
      var gio = moment.tz("Asia/Manila").format("HH:mm:ss || MM/DD/YYYY");
      return await messenger.send(
        helpPostBack(global.langText("settings", "prefix", global.config.PREFIX, gio))
      );
    }

    const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
    var best = similar.findBestMatch(commandName, global.commandsList);

    if (best.bestMatch.rating > 0.5) {
      try {
        return await runCommand(global.commandsList[best.bestMatchIndex], args, messenger);
      } catch (err) {
        return await messenger.send("An error occurred while executing the command.");
      }
    } else {
      return await messenger.send(
        helpPostBack(global.langText("settings", "wrongCommand", global.config.PREFIX))
      );
    }
  }
};

const helpPostBack = (message) => {
  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: message,
        buttons: [
          {
            type: "postback",
            title: `${global.config.BOTNAME}help`,
            payload: "HELP_COMMAND"
            }
          ]
      }
    }
  }
}