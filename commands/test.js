const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = (args) => {
  const request = require("request");
  const fs = require("fs-extra");
  const path = require("path");

  global.sendMessage("Success");

  const tempImagePath = path.join('/tmp', 'test.png'); // Using /tmp for temporary storage

  const callback = () => {
    const attachment = {
      type: "image",
      payload: {
        url: `https://your-cdn-or-url.com/test.png`, // Update this to your CDN or storage URL
        is_reusable: true
      }
    };

    global.sendMessage({
      text: "Here is your image:",
      attachment: attachment
    });

    // Clean up the file after sending
    fs.unlinkSync(tempImagePath);
  };

  return request(encodeURI(`https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
    .pipe(fs.createWriteStream(tempImagePath))
    .on('close', () => callback());
};

module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute
};
