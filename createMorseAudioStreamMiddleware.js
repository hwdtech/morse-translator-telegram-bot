const url = require('url');
const morse = require('morsify');
const createMorseAudioStream = require('./createMorseAudioStream');

module.exports = (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const encodedMessage = morse.encode(query.message);

  res.setHeader('Content-Type', 'audio/mpeg');

  createAudioStream(encodedMessage).pipe(res);
};
