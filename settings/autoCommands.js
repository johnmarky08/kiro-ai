const screenshot = async (messageText, messenger) => {
  try {
    messageText = encodeURIComponent(messageText.split(' | ')[0]);
    await messenger.send({
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: '🔗 Link detected... Generating a screenshot.',
          buttons: [
            {
              type: 'web_url',
              title: 'View Website',
              url: messageText
            }
          ]
        }
      }
    });
    return await messenger.send({
      attachment: {
        type: 'image',
        payload: {
          is_reusable: true,
          url: `https://muichiro-api.vercel.app/screenshot?api_key=muichiro&link=${messageText}${(messageText.includes(' | fresh') ? 'fresh=true' : '')}`
        }
      }
    });
  } catch (error) {
    return console.error('Auto Screenshot:', error.stack);
  }
}

module.exports = {
  screenshot
}