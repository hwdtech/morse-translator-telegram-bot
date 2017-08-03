const { Composer } = require('micro-bot');
const morse = require('morse');
const app = new Composer();

app.on('text', ({ reply, message }, next) => {
  if (Math.random() > 0.5) {
    return next();
  }
  return reply(morse.encode(message));
});

module.exports = app;
