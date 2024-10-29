const commandName = "neko";
const version = "1.0.0";
const permission = 0;
const description = "Random Nekooo 😻";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");

    const neko = (await axios.get("https://nekos.best/api/v2/neko")).data.results[0];
    const imageUrl = (await axios.get("https://muichiro-api.vercel.app/imgur?api_key=muichiro&link=" + neko.url)).data.result;

    const attachment = {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl,
        },
      }
    };

    await messenger.send(attachment);

    const messageText = `Artist: ${neko.artist_name}\nView Artist: ${neko.artist_href}\nView Art: ${neko.source_url}`;
    await messenger.send({ text: messageText });

  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send({ text: "An error occurred while processing your request." });
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