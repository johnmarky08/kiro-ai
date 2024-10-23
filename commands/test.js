const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "Fir testing purposes";
const author = "John Marky Dev";


const execute = (args) => {
  const request = require("request");
  const fs = require("fs-extra");

  global.sendMessage("Success");
  var callback = () => {
    const imagePath = __dirname + '/cache/test.png';

    const attachment = {
      type: "image",
      payload: {
        url: imagePath,
        is_reusable: true
      }
    };

    global.sendMessage({
      text: "Here is your image:",
      attachment: attachment
    });

    fs.unlinkSync(__dirname + "/cache/test.png")
  };

  return request(encodeURI(`https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/test.png')).on('close', () => callback());
}