const axios = require('axios');

module.exports = async (req, res) => {
  try {
    console.log("Cron job executed");
    
    await axios.get('https://facebook-page-bot.vercel.app/');
    res.status(200).json({ message: 'Webhook pinged successfully' });
  } catch (error) {
    console.error('Failed to ping webhook:', error);
    res.status(500).json({ error: 'Webhook ping failed' });
  }
};
