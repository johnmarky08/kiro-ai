const screenshot = async ({ userMessage, messenger }) => {
  try {
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
              url: userMessage
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
          url: `https://muichiro-api.vercel.app/screenshot?api_key=muichiro&link=${userMessage}`
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