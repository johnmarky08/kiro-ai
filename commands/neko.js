const commandName = "neko";
const version = "1.0.0";
const permission = 0;
const description = "Random Nekooo 😻";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");
    const neko = (await axios.get("https://nekos.best/api/v2/neko")).data.results[0];
    console.log(JSON.stringify(neko));
    const attachment = {
      type: "image",
      payload: {
        url: encodeURIComponent(neko.url),
        is_reusable: true,
      },
    };
    await messenger.send({ attachment });
    return await messenger.send(`Artist: ${neko.artist_name}\nView Artist: ${neko.artist_href}\nView Art: ${neko.source_url}`);
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