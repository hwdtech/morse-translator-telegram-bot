const qs = require('querystring');
const {
  CharStream,
  TextEncoder,
  AudioEncoder
} = require('morsea');
const pump = require('pump');
const lame = require('lame');
const ogg = require('ogg');
const opus = require('node-opus');

function createAudioStream(text) {
  return pump(
    CharStream.create(text),
    TextEncoder.create(),
    AudioEncoder.create()
  );
}

module.exports = {
  ogg(req, res) {
    const { message } = req.param;

    if (!message) {
      return res.sendStatus(404);
    }

    const text = qs.unescape(message);

    const oggEncoder = new ogg.Encoder();
    pump(oggEncoder, res);

    pump(
      createAudioStream(text),
      new opus.Encoder(48000, 2),
      oggEncoder.stream()
    );
  },

  mp3(req, res) {
    const { message } = req.param;

    if (!message) {
      return res.sendStatus(404);
    }

    const text = qs.unescape(message);

    pump(
      createAudioStream(text),
      new lame.Encoder({ bitRate: 32 }),
      res
    );

  },

  mp3Url(message) {
    return `${qs.encode(message)}.mp3`
  },

  oggUrl(message) {
    return `${qs.encode(message)}.ogg`
  }
};
