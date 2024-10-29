const commandName = "pinterest";
const version = "1.0.0";
const permission = 0;
const description = "Search on Pinterest";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");
    var keySearch = args;

    if (!keySearch.includes("-")) return await messenger.send(`Wrong Format!\n\nExample: ${global.config.PREFIX}${commandName} Muichiro - 10 (<-- This number depends on the number of pictures you want to get).`);

    var keySearchs = keySearch.substr(0, keySearch.indexOf("-")).trim();
    const numberSearch = keySearch.split("-").pop();
    const res = await axios.get(`https://muichiro-api.vercel.app/pinterest?search=${encodeURIComponent(keySearchs)}&api_key=muichiro`);

    if ((parseInt(numberSearch) > res.data.count) || (parseInt(numberSearch) > 30)) return await messenger.send(`Cannot Search More Than ${(parseInt(numberSearch) > res.data.count ? res.data.count : 30)} Pictures Of ${keySearchs}!`);

    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      imgData.push(data[i]);
    }
    return await messenger.sendImages(imgData);
  } catch (e) {
    return await messenger.send("Error: " + e.stack);
  }
}

module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute,
};