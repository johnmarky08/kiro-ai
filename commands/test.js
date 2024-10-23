const commandName = "test";
const version = "1.0.0";
const permission = 0;
const description = "For testing purposes";
const author = "John Marky Dev";

const execute = (args) => {
  await global.sendMessage("Success");

  // Construct the Facebook Graph API URL for the profile picture
  const imageUrl = `https://graph.facebook.com/${args}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  const attachment = {
    type: "image",
    payload: {
      url: imageUrl, // Use the direct URL from the Facebook Graph API
      is_reusable: true
    }
  };
  
  console.log("sending attachment");

  await global.sendMessage({
    text: "Here is your image:",
    attachment: attachment
  });
};

module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute
};
