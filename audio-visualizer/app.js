window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const urls = {
  blueyellow: 'audios/blueyellow.wav',
  techno: 'audios/techno.wav',
  organ: 'audios/organ-echo-chords.wav',
};

const audioVisualizer = new AudioVisualizer(document.querySelector('#visualizer-mount'), {
  width: 1000, height: 500
});

function errorCallback (e) {
  console.log('Reeeejected!', e);
};

function loadSound(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = callback;

  xhr.send();
}

loadSound(urls.techno, function(event) {
  let { response } = event.target;

  audioCtx.decodeAudioData(response, function(buffer) {
    playSound(audioCtx, buffer);
    audioVisualizer.visualize(buffer);
  }, errorCallback);
});

function playSound(ctx, buffer) {
  let source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}