const commandName = "lang";
const version = "1.0.0";
const permission = 0;
const description = "Change bot language";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const path = require("path"),
      fs = require("fs-extra"),
      langPath = path.join(__dirname, "..", "config.json"),
      language = require(__dirname + "/../settings/lang.json");
    let lang = require(langPath);
    let _lang = global.config.language;
    if (!args) {
      if (_lang === "en") {
        lang.lang = "tl";
        fs.writeFileSync(langPath, JSON.stringify(lang, null, 2), "utf-8");
        return messenger.send(
          "Language Has Been Successfully Changed Into Tagalog (tl)",
        );
      } else {
        lang.lang = "en";
        fs.writeFileSync(langPath, JSON.stringify(lang, null, 2), "utf-8");
        return messenger.send(
          "Language Has Been Successfully Changed Into English (en)",
        );
      }
    } else {
      if (language[args]) {
        lang.lang = args;
        fs.writeFileSync(langPath, JSON.stringify(lang, null, 2), "utf-8");
        return messenger.send(
          "Language Has Been Successfully Changed Into " + args.toUpperCase(),
        );
      } else {
        return messenger.send(
          "The Language You Just Entered Is Not Available!",
        );
      }
    }
  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send("An error occurred while processing your request.");
  }
};


module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute
};