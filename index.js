const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const messageHandler = require('./handlers/messageHandler');
const postBackHandler = require('./handlers/postBackHandler');
const { language } = require('./settings/functions.js');

require('dotenv').config();
const app = express();
app.use(express.json());

// Globals
global.config = require('./config.json');
global.language = language;
global.commandsList = [];

// Load Commands
var filteredFiles = fs
  .readdirSync('./commands/')
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js');
filteredFiles.map((file) => {
  var fileName = require(path.join(__dirname, 'commands', file));
  console.log(
    'Command ' +
    fileName.commandName +
    ' Successfully Loaded → Version: ' +
    fileName.version
  );
  global.commandsList.push(fileName.commandName);
});

const VERIFY_TOKEN = 'pagebot';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get('/', (request, response) => {
  response.send('Success!');
});

app.get('/webhook', (request, response) => {
  const mode = request.query['hub.mode'];
  const token = request.query['hub.verify_token'];
  const challenge = request.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      response.status(200).send(challenge);
    } else {
      response.sendStatus(403);
    }
  }
});

app.post('/webhook', async (request, response) => {
  try {
    const body = request.body;

    if (body.object === 'page') {
      response.status(200).send('EVENT_RECEIVED');

      const entry = body.entry[0];
      if (entry.messaging) {
        const event = entry.messaging[0];
        if (event.)
        
        if (event.message) {
          await messageHandler(event, PAGE_ACCESS_TOKEN);
        } else if (event.postback) {
          await postBackHandler(event, PAGE_ACCESS_TOKEN);
        }
      }
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    response.sendStatus(500);
  }
});

app.use((error, request, response, next) => {
  console.error('Error occurred:', error.stack);
  response.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});