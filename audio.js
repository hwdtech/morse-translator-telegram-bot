const qs = require('querystring');
const {
  CharStream,
  TextEncoder,
  AudioEncoder
} = require('morsea');
const pump = require('pump');
const ogg = require('ogg');
const opus = require('node-opus');

module.exports = {
  ogg(req, res) {
    const { message } = req.params;

    if (!message) {
      return res.sendStatus(404);
    }

    const text = qs.unescape(message);

    const oggEncoder = new ogg.Encoder();
    res.setHeader('Content-Type', 'audio/ogg');
    pump(oggEncoder, res);

    pump(
      CharStream.create(text),
      TextEncoder.create(),
      AudioEncoder.create({
        frequency: 700,
        unitDuration: 0.12,
        sampleRate: 48000
      }),
      new opus.Encoder(),
      oggEncoder.stream()
    );
  },

  encodeUrl(base, message) {
    return `${base}/${qs.escape(message)}`;
  }
};
