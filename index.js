const Telegraf = require('telegraf');
const express = require('express');
const uuid = require('uuid');
const morseController = require('./createMorseAudioStreamMiddleware');

const { BOT_TOKEN, BOT_DOMAIN, PORT } = process.env;

const app = new Telegraf(BOT_TOKEN);

app.on('text', ({ replyWithAudio, message }) => {
  console.log(`Incomming message: ${message.text}`);
  return replyWithAudio({
    audio: `${BOT_DOMAIN}/morsify?message=${message.text}`,
    caption: message.slice(0, 200),
    title: message.slice(0, 10),
    reply_to_message_id: message.id
  });
});

app.telegram.getMe()
  .then(info => console.log(`Server has initialized bot nickname. Nick: ${info.username}`))
  .catch(err => console.error(err));

const server = express();
const webHookPath = `/tb${uuid()}`;
server.use(app.webhookCallback(webHookPath));

server.get('/morsify', morseController);

server.listen(PORT, () => {
  console.log(`Bot server started at: ${BOT_DOMAIN}`);
  console.log(`Webhook mounted at ${webHookPath}`);
});
