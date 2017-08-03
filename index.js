const { Composer } = require('micro-bot');
const app = new Composer();

app.command('/start', ({ reply }) => reply('Welcome!'));
app.hears('hi', ({ reply }) => reply('Hey there!'));
app.on('sticker', ({ reply }) => reply('👍'));

module.exports = app;
