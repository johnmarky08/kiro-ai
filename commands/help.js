const commandName = 'help';
const version = '1.0.0';
const permission = 0;
const description = 'List of all commands and its description';
const author = 'John Marky Dev';

const execute = async ({ userMessage, messenger }) => {
  try {
    const axios = require('axios');

    try {
      var commandInfo = require(`./${userMessage.toLowerCase()}.js`);
      if (!parseInt(userMessage)) {
        var p = commandInfo.permission,
          _perm =
          p == 1 ?
          'Admins' :
          p == 2 ?
          'On Maintenance' :
          p == 3 ?
          'John Marky Dev' :
          'Everyone';
        return await messenger.send(
          `📝 DESCRIPTION OF ${userMessage.toUpperCase()}\n\n» Name: ${
            commandInfo.commandName
          }\n» Version: ${commandInfo.version}\n» Description: ${
            commandInfo.description
          }\n» Author: ${commandInfo.author}\n» Has Permission: ${_perm}`
        );
      }
    } catch {
      var one = 10;
      var page = parseInt(userMessage) || 1;
      if (page < 1) return await messenger.send('No page less than 1!');
      await messenger.send('Please Wait... ⚙️');
      var response = await axios.get(
        'https://muichiro-api.vercel.app/facts?api_key=muichiro'
      );
      var factss = response.data.data;
      let text = '';
      var listFile = [];
      global.commandsList.forEach((command) => {
        listFile.push(command);
      });
      for (var i = 0; i < listFile.length; i++) {
        listFile[i] = listFile[i][0].toUpperCase() + listFile[i].slice(1);
      }
      listFile.sort((a, b) => a.data - b.data);
      var lastPage = Math.ceil(listFile.length / one);
      if (page > lastPage) page = lastPage;
      var slice = one * page - one;
      const newList = listFile.slice(slice, slice + one);
      for (let item of newList) {
        text += `〘 ${++slice} 〙 ` + global.config.prefix + item + '\n';
      }
      return await messenger.send(
        `『 LIST OF COMMANDS 』\n\n${text}\n[ DYK ]: ${factss}\n\n➣ Page  ${page} / ${lastPage}\n\nThere Are Currently A Total Of ${listFile.length} Commands Available In ${global.config.botName} Bot`
      );
    }
  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send('An error occurred while processing your request.');
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