const Telegraf = require('telegraf');
const express = require('express');
const uuid = require('uuid');
const audioController = require('./audio');

const { BOT_TOKEN, BOT_DOMAIN, PORT } = process.env;

const app = new Telegraf(BOT_TOKEN);
const webHookPath = `/tb${uuid()}`;

function getAudioUrl(message) {
  console.log('Replying with audio:', `${BOT_DOMAIN}/${audioController.mp3Url(message)}`);
  return `${BOT_DOMAIN}/${audioController.mp3Url(message)}`;
}

function getVoiceUrl(message) {
  console.log('Replying with voice:', `${BOT_DOMAIN}/${audioController.oggUrl(message)}`);
  return `${BOT_DOMAIN}/${audioController.oggUrl(message)}`;
}

app.on('text', ({ replyWithVoice, message }) => {
  return replyWithVoice(getVoiceUrl(message.text));
});

app.on('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  return answerInlineQuery([{
    type: 'audio',
    id: uuid(),
    title: inlineQuery.query,
    audio_url: getAudioUrl(inlineQuery.query)
  }]);
});

app.telegram.getMe()
  .then(info => {
    console.log(`Server has initialized bot nickname. Nick: ${info.username}`);

    const server = express();
    server.use(app.webhookCallback(webHookPath));

    server.get('/:message.mp3', audioController.mp3);
    server.get('/:message.ogg', audioController.ogg);

    server.listen(PORT, () => {
      console.log(`Webhook mounted at ${BOT_DOMAIN}${webHookPath}`);
      app.telegram.setWebhook(`${BOT_DOMAIN}${webHookPath}`);
    });
  })
  .catch(err => console.error(err));
