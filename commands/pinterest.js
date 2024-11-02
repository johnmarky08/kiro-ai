const commandName = 'pinterest';
const version = '1.0.0';
const permission = 0;
const description = 'Search on Pinterest';
const author = 'John Marky Dev';
const payload = 'PINTEREST_COMMAND';

const execute = async ({ userMessage, messenger }) => {
  try {
    const axios = require('axios');
    var keySearch = userMessage;

    if (!keySearch.includes('-')) return await messenger.send(`Wrong Format!\n\nExample: ${global.config.prefix}${commandName} Muichiro - 10 (<-- This number depends on the number of pictures you want to get).`);

    var keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
    const numberSearch = keySearch.split('-').pop();
    const response = await axios.get(`https://muichiro-api.vercel.app/pinterest?search=${encodeURIComponent(keySearchs)}&api_key=muichiro`);
    const maxSearch = 10;

    if ((parseInt(numberSearch) > response.data.count) || (parseInt(numberSearch) > maxSearch)) return await messenger.send(`Cannot Search More Than ${(parseInt(numberSearch) > response.data.count ? response.data.count : maxSearch)} Pictures Of '${keySearchs}'!`);

    const data = response.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      imgData.push(data[i]);
    }
    return await messenger.sendImages(imgData, 'View/Download Photo');
  } catch (error) {
    return await messenger.send('Error: ' + error.stack);
  }
}

module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute,
  payload
};