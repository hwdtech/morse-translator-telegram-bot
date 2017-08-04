const _ = require('lodash/fp');
const async = require('async');
const lame = require('lame');
const Through = require('audio-through');
const audioBufferUtils = require('audio-buffer-utils');

const OSCILLATOR_FREQUENCY = 100;
const DOT_DURATION = 0.875;
const SAMPLE_RATE = 8000;

function createAudioBuffer(duration, frequency) {
  const audioBuffer = audioBufferUtils.create(SAMPLE_RATE * duration, 1, SAMPLE_RATE);

  audioBufferUtils.fill(audioBuffer, (value, i, channel) => Math.sin(2 * Math.PI * i * frequency / SAMPLE_RATE));

  return audioBuffer;
}

const createAudioBufferFormCharacter = _.cond([
  [_.isEqual('.'), () => createAudioBuffer(DOT_DURATION, OSCILLATOR_FREQUENCY)],
  [_.isEqual('-'), () => createAudioBuffer(DOT_DURATION * 3, OSCILLATOR_FREQUENCY)],
  [() => true, () => createAudioBuffer(0, 0)]
]);

function createMorseAudioStream(encodedMessage = '') {
  const audioBuffers = [];
  const through = new Through();
  const outStream = new lame.Encoder();

  encodedMessage.split('').forEach((ch) => {
    audioBuffers.push(createAudioBufferFormCharacter(ch));
    audioBuffers.push(createAudioBuffer(DOT_DURATION, 0));
  });

  through.on('end', () => outStream.end());
  through.pipe(outStream);

  async.whilst(
    () => through.frame <= audioBuffers.length,
    next => through.write(audioBuffers[through.frame], next),
    () => through.end()
  );

  return outStream;
}

module.exports = createMorseAudioStream;
