const express = require("express");
const messageHandler = require("./handlers/messageHandler");
const postBackHandler = require("./handlers/postBackHandler");
const { langText } = require("./settings/functions.js");

const app = express();
app.use(express.json());

// Globals
global.config = require("./config.json");
global.langText = langText;

const VERIFY_TOKEN = "pagebot";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get("/", (req, res) => {
  res.send("Success!");
})

app.get("/webhook", (req, res) => {
  const hub = req.query.hub;
  const mode = hub.mode;
  const token = hub.verify_token;
  const challenge = hub.challenge;

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page') {
      res.status(200).send('EVENT_RECEIVED');

      const entry = body.entry[0];
      if (entry.messaging) {
        const event = entry.messaging[0];
        if (event.message) {
          await messageHandler(event, PAGE_ACCESS_TOKEN);
        } else if (event.postback) {
          await postBackHandler(event, PAGE_ACCESS_TOKEN);
        }
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.sendStatus(500);
  }
});

app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});