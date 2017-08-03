const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  const { query } = inlineQuery;
  const result = [{
    message_test: query.toUpperCase()
  }];
  return answerInlineQuery(result);
});

bot.startPolling();
