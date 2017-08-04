const Telegraf = require('telegraf');
const express = require('express');
const uuid = require('uuid');
const morseController = require('./createMorseAudioStreamMiddleware');

const { BOT_TOKEN, BOT_DOMAIN, PORT } = process.env;

const app = new Telegraf(BOT_TOKEN);

app.on('text', ({ replyWithAudio, message }) => {
  console.log(`Message received: ${message.text}`);
  return replyWithAudio({
    audio: `${BOT_DOMAIN}/?message=${message.text}`,
    caption: message.slice(0, 200),
    title: message.slice(0, 10),
    reply_to_message_id: message.id
  });
});

const server = express();
const webHookPath = `/tb${uuid()}`;
server.use(app.webhookCallback(webHookPath));

server.get('/ping', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end('pong');
});

server.get('/', morseController);

server.listen(PORT, () => {
  console.log(`Bot server started at: ${BOT_DOMAIN}`);
  console.log(`Webhook mounted at ${webHookPath}`);
});
