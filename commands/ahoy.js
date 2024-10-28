const commandName = "help";
const version = "1.0.0";
const permission = 0;
const description = "List of all commands and its description";
const author = "John Marky Dev";

const Wrap = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

const execute = async ({ args, messenger }) => {
  try {
    const { loadImage, createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    let pathImg = __dirname + '/cache/ahoy.png';
    var text = args;
    if (!text) return messenger.send(global.langText("commands", "noText"));
    let _getImg = (await axios.get(`https://i.imgur.com/FofqkNz.jpg`, { responseType: 'arraybuffer' })).data;
    let baseImage = Buffer.from(_getImg, 'utf-8');
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    let fontSize = 20;
    while (ctx.measureText(text).width > 2000) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial, Regular`;
    }
    const lines = await Wrap(ctx, text, 450);
    ctx.fillText(lines.join('\n'), 45, 135);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    return messenger.send({
      attachment: {
        type: "image",
        payload: {
          url: imageBuffer,
          is_reusable: true,
        },
      },
    });
  } catch (e) {
    return messenger.send("Error: " + e)
  }
}