const commandName = "pinterest";
const version = "1.0.0";
const permission = 0;
const description = "Search on Pinterest";
const author = "Joshua Sy";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");
    var keySearch = args;

    if (!keySearch.includes("-")) return await messenger.send(`Please enter in the format, example: ${global.config.PREFIX}pinterest Naruto - 10 (it depends on you how many images you want to appear in the result)`);

    var keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
    const numberSearch = keySearch.split("-").pop();
    const res = await axios.get(`https://muichiro-api.vercel.app/pinterest?search=${encodeURIComponent(keySearchs)}&api_key=muichiro`);

    if ((parseInt(numberSearch) > res.data.count) || (parseInt(numberSearch) > 30)) return await messenger.send(`Cannot Search More Than ${(parseInt(numberSearch) > res.data.count ? res.data.count : 50)} Pictures Of ${keySearchs}!`);

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