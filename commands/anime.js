const commandName = "anime";
const version = "1.0.0";
const permission = 0;
const description = "Random Anime Pictures";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");
    const BASE_URL = "https://api.waifu.pics/";
    const sfwTags = [
      "waifu",
      "neko",
      "shinobu",
      "megumin",
      "bully",
      "cuddle",
      "cry",
      "hug",
      "awoo",
      "kiss",
      "lick",
      "pat",
      "smug",
      "bonk",
      "yeet",
      "blush",
      "smile",
      "wave",
      "highfive",
      "handhold",
      "nom",
      "bite",
      "glomp",
      "slap",
      "kill",
      "kick",
      "happy",
      "wink",
      "poke",
      "dance",
      "cringe"
    ];
    const nswfTags = [
      "waifu",
      "neko",
      "trap",
      "blowjob"
    ];
    var imageUrl = "";
    if (!args) {
      imageUrl = (await axios.get(BASE_URL + "sfw/waifu")).data.url;
    } else if (!args.includes("*") && args == "list") {
      return await messenger.send(`SFW TAGS\n\n${sfwTags.join(", ")}`);
    } else if (!args.includes("*") && sfwTags.includes(args)) {
      imageUrl = (await axios.get(BASE_URL + "sfw/" + args)).data.url;
    } else if (args.includes("*") && args.replace("*", "") == "list") {
      return await messenger.send(`NSFW TAGS\n\n${nswfTags.join(", ")}`);
    } else if (args.includes("*") && nswfTags.includes(args.replace("*", ""))) {

      imageUrl = (await axios.get(BASE_URL + "nsfw/" + args.replace("*", ""))).data.url;
    } else {
      return await messenger.send("The tags you've given is invalid!");
    }
    const attachment = {
      type: "image",
      payload: {
        url: imageUrl,
        is_reusable: true,
      },
    };
    return await messenger.send({ attachment });
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
  execute,
};