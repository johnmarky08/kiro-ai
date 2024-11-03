const screenshot = async (messageText, messenger) => {
  try {
    let text = messageText;
    if (messageText.includes(' | ')) text = messageText.split(' | ')[0];
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
              url: text
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
          url: `https://muichiro-api.vercel.app/screenshot?api_key=muichiro&link=${text}${(messageText.includes(' | fresh') ? 'fresh=true' : '')}`
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