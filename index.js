const qs = require('querystring');
const Telegraf = require('telegraf');
const express = require('express');
const uuid = require('uuid');
const morseController = require('./createMorseAudioStreamMiddleware');

const { BOT_TOKEN, BOT_DOMAIN, PORT } = process.env;

const app = new Telegraf(BOT_TOKEN);
const webHookPath = `/tb${uuid()}`;

function getUrl(text) {
  return `${BOT_DOMAIN}/morsify?message=${qs.escape(text)}`;
}

app.on('text', ({ replyWithAudio, message }) => {
  return replyWithAudio(getUrl(message.text));
});

app.on('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  console.log(`Answer with ${getUrl(inlineQuery.query)}`);
  return answerInlineQuery([{
    type: 'audio',
    id: uuid(),
    title: inlineQuery.query,
    audio_url: getUrl(inlineQuery.query)
  }]);
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
