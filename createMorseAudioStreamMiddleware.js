const qs = require('querystring');
const morse = require('morsify');
const createMorseAudioStream = require('./createMorseAudioStream');

module.exports = (req, res) => {
  const { message } = req.query;

  if (!message) {
    return res.sendStatus(404);
  }

  const encodedMessage = morse.encode(qs.unescape(message));

  res.setHeader('Content-Type', 'audio/mpeg');
  createMorseAudioStream(encodedMessage).pipe(res);
};
