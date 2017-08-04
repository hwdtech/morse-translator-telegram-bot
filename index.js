const qs = require('querystring');
const Telegraf = require('telegraf');
const express = require('express');
const uuid = require('uuid');
const morseController = require('./createMorseAudioStreamMiddleware');

const { BOT_TOKEN, BOT_DOMAIN, PORT } = process.env;

const app = new Telegraf(BOT_TOKEN);
const webHookPath = `/tb${uuid()}`;

app.on('text', ({ replyWithAudio, message }) => {
  return replyWithAudio(`${BOT_DOMAIN}/morsify?message=${qs.escape(message.text)}`);
});

app.telegram.getMe()
  .then(info => {
    console.log(`Server has initialized bot nickname. Nick: ${info.username}`);

    const server = express();
    server.use(app.webhookCallback(webHookPath));

    server.get('/morsify', morseController);

    server.listen(PORT, () => {
      console.log(`Webhook mounted at ${BOT_DOMAIN}${webHookPath}`);
      app.telegram.setWebhook(`${BOT_DOMAIN}${webHookPath}`);
    });
  })
  .catch(err => console.error(err));
