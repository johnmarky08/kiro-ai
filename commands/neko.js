const commandName = "neko";
const version = "1.0.0";
const permission = 0;
const description = "Random Nekooo 😻";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");

    const neko = (await axios.get("https://nekos.best/api/v2/neko")).data.results[0];
    const imageUrl = neko.url;

    const headResponse = await axios.head(imageUrl);
    const contentLength = headResponse.headers["content-length"];

    const imageSizeMB = parseInt(contentLength, 10) / (1024 * 1024);
    if (imageSizeMB > 25) {
      await messenger.send({ text: "The image is too large to send via Messenger (over 25 MB)." });
      return;
    }

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
