const commandName = 'ahoy';
const version = '1.0.0';
const permission = 0;
const description = 'Ahoy Canvas';
const author = 'John Marky Dev';
const payload = 'AHOY_COMMAND';

const wrap = (context, text, maxWidth) => {
  return new Promise(resolve => {
    if (context.measureText(text).width < maxWidth) return resolve([text]);
    if (context.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (context.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (context.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

const execute = async ({ userMessage, messenger }) => {
  const { registerFont, loadImage, createCanvas } = require('canvas');
  const path = require('path');
  const axios = require('axios');

  registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'LiberationSans-Regular.ttf'), { family: 'Arial' });
  try {

    let text = userMessage;
    if (!text) return await messenger.send(global.language('commands', 'noText'));
    
    await messenger.send('⏱️ Creating Image, Please Wait...');

    let _getImg = (await axios.get(`https://i.imgur.com/FofqkNz.jpg`, { responseType: 'arraybuffer' })).data;
    let baseImage = await loadImage(Buffer.from(_getImg, 'utf-8'));

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let context = canvas.getContext('2d');
    context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    context.font = '400 18px Arial';
    context.fillStyle = '#000000';
    context.textAlign = 'start';

    let fontSize = 20;
    while (context.measureText(text).width > 2000) {
      fontSize--;
      context.font = `400 ${fontSize}px Arial, Regular`;
    }

    const lines = await wrap(context, text, 450);
    context.fillText(lines.join('\n'), 45, 135);
    context.beginPath();

    const imageBuffer = canvas.toBuffer();
    const base64Image = imageBuffer.toString('base64');

    const response = await axios.post('https://api.imgur.com/3/image', {
      image: base64Image,
      type: 'base64'
    }, {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    });

    const imageUrl = response.data.data.link;

    return await messenger.send({
      attachment: {
        type: 'image',
        payload: {
          url: imageUrl,
          is_reusable: true,
        },
      },
    });
  } catch (error) {
    return await messenger.send('Error: ' + error.stack);
  }
};


module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute,
  payload
};