const screenshot = async ({ userMessage, messenger }) => {
  try {
    await messenger.send({
      attachment: {
        type: 'image',
        payload: {
          is_reusable: true,
          url: `https://api.site-shot.com/?url=${userMessage}/docs&userkey=${process.env.SITE_SHOT_API_KEY}&width=1920&height=1080`
        }
      }
    });
    return await messenger.send({
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: '🔗 Link detected... Generated a screenshot.',
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
  } catch (error) {
    return console.error('Auto Screenshot:', error.stack);
  }
}

module.exports = {
  screenshot
}