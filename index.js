const express = require("express");
const handleMessage = require("./handlers/handleMessage");
const handlePostback = require("./handlers/handlePostback");

const app = express();
app.use(express.json());

global.config = require("./config.json");

// Set the verify token and page access token
const VERIFY_TOKEN = "pagebot";
// Read the token from the file
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get("/", (req, res) => {
  res.send("Success!");
})

// Verify that the verify token matches
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

// Handle messages and postbacks
app.post("/webhook", (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page') {
      var entry = body.entry[0];
      if (entry.messaging) {
        var event = entry.messaging[0];
        if (event.message) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
        } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        }
      }
      return res.status(200).send("EVENT_RECEIVED");
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.sendStatus(500);
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});