const { mount } = require('micro-bot');

module.exports = mount('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  const { query } = inlineQuery;
  const result = [{
    message_test: query.toUpperCase()
  }];
  return answerInlineQuery(result);
});
