const express = require("express");
const WebSocket = require("ws");
const messageHandler = require("./handlers/messageHandler");
const postBackHandler = require("./handlers/postBackHandler");

const app = express();
app.use(express.json());

global.config = require("./config.json");

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

app.post("/webhook", (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page') {
      res.status(200).send('EVENT_RECEIVED');

      const entry = body.entry[0];
      if (entry.messaging) {
        const event = entry.messaging[0];
        if (event.message) {
          messageHandler(event, PAGE_ACCESS_TOKEN);
        } else if (event.postback) {
          postBackHandler(event, PAGE_ACCESS_TOKEN);
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

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

setInterval(() => {
  const updateMessage = { text: "This is an update message." };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(updateMessage));
    }
  });
}, 5000);