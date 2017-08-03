const { Composer } = require('micro-bot');
const morse = require('xmorse');
const app = new Composer();

app.on('text', ({ reply, message }, next) => {
  if (Math.random() > 0.5) {
    return next();
  }
  return reply(morse.encode(message.text));
});

module.exports = app;
