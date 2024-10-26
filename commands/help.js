const commandName = "help";
const version = "1.0.0";
const permission = 0;
const description = "List of all commands and its description";
const author = "John Marky Dev";

const execute = async ({ args, messenger }) => {
  try {
    const axios = require("axios");

    try {
      var commandInfo = require(`./${args.toLowerCase()}.js`);
      if (!parseInt(args)) {
        var p = commandInfo.permission,
          _perm =
          p == 1 ?
          "Admins" :
          p == 2 ?
          "On Maintenance" :
          p == 3 ?
          "John Marky Dev" :
          "Everyone";
        return await messenger.send(
          `📝 DESCRIPTION OF ${args.toUpperCase()}\n\n» Name: ${
            commandInfo.commandName
          }\n» Version: ${commandInfo.version}\n» Description: ${
            commandInfo.description
          }\n» Author: ${commandInfo.author}\n» Has Permission: ${_perm}`
        );
      }
    } catch {
      messenger.send("Please Wait... ⚙️");
      var one = 10;
      var page = parseInt(args) || 1;
      if (page < 1) return await messenger.send("No page less than 1!");
      var res = await axios.get(
        "https://muichiro-api.vercel.app/facts?api_key=muichiro"
      );
      var factss = res.data.data;
      let text = "";
      var listFile = [];
      global.commandsList.forEach((command) => {
        listFile.push(command);
      });
      for (var i = 0; i < listFile.length; i++) {
        listFile[i] = listFile[i][0].toUpperCase() + listFile[i].slice(1);
      }
      listFile.sort((a, b) => a.data - b.data);
      var tpage = Math.ceil(listFile.length / one);
      if (page > tpage) page = tpage;
      var slice = one * page - one;
      const bago = listFile.slice(slice, slice + one);
      for (let item of bago) {
        text += `〘 ${++slice} 〙 ` + global.config.PREFIX + item + "\n";
      }
      return await messenger.send(
        `『 LIST OF COMMANDS 』\n\n` +
        text +
        "\n[ DYK ]: " +
        factss +
        `\n\n➣ Page ` +
        page +
        "/" +
        tpage +
        `\n\nThere Are Currently A Total Of ` +
        listFile.length +
        ` Commands Available In ` +
        global.config.BOTNAME +
        ` Bot`
      );
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
  execute,
};