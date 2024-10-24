const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const messageHandler = require("./handlers/messageHandler");
const postBackHandler = require("./handlers/postBackHandler");

const app = express();
app.use(express.json());
app.set('trust proxy', true);

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : req.connection.remoteAddress;
};

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  keyGenerator: (req, res) => getClientIp(req)
});
app.use(limiter);
app.use(morgan('combined'));

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