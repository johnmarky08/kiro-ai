const path = require("path");
const moment = require("moment-timezone");
const similar = require("string-similarity");
const commandsPath = path.join(__dirname, "..", "commands");
const Messenger = require("../model/messenger");

module.exports = async (event, pageAccessToken) => {
  const messageText = event.message.text;
  const args = messageText.split(" ").slice(1).join(" ") || "";
  const messenger = new Messenger(event, pageAccessToken);

  if (event.message && event.message.quick_reply) {
    const quickReplyPayload = event.message.quick_reply.payload;

    await quickReplies(messenger, quickReplyPayload, args);
  } else if (messageText[0] === global.config.PREFIX) {
    if (messageText === global.config.PREFIX) {
      var gio = moment.tz("Asia/Manila").format("HH:mm:ss || MM/DD/YYYY");
      return await messenger.send(
        helpQuickReply(
          messenger,
          global.langText("settings", "prefix", global.config.PREFIX, gio)
        )
      );
    }

    const commandName = messageText.split(" ")[0].slice(1).toLowerCase();
    var best = similar.findBestMatch(commandName, global.commandsList);

    if (best.bestMatch.rating > 0.5) {
      try {
        await runCommand(global.commandsList[best.bestMatchIndex], args, messenger);
      } catch (err) {
        await messenger.send("An error occurred while executing the command.");
      }
    } else {
      await messenger.send(
        helpQuickReply(
          messenger,
          global.langText("settings", "wrongCommand", global.config.PREFIX)
        )
      );
    }
  }
};

const runCommand = async (commandName, args, messenger) => {
  const commandPath = path.join(commandsPath, commandName);
  const command = require(commandPath);

  if (typeof command.execute === "function") {
    await command.execute({ args, messenger });
  } else {
    await messenger.send("Execute function is not defined!");
  }
}

const quickReplies = async (messenger, payload, args) => {
  if (payload == "HELP_COMMAND") {
    await runCommand("help", args, messenger);
  }
}

const helpQuickReply = (messenger, message) => {
  return {
    text: message,
    quick_replies: [
      {
        content_type: "text",
        title: `${global.config.PREFIX}help`,
        payload: "HELP_COMMAND"
      }
    ]
  }
}