const { Composer } = require('micro-bot');
const morse = require('morsify');
const app = new Composer();

app.on('text', ({ reply, message }) => {
  return reply(morse.encode(message.text));
});

module.exports = app;
