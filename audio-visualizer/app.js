window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

const audioCtx = new AudioContext();
const urls = {
  blueyellow: 'audios/blueyellow.wav',
  techno: 'audios/techno.wav',
  organ: 'audios/organ-echo-chords.wav',
};

const visualizer = new AudioVisualizer(audioCtx, document.querySelector('#visualizer-mount'), {
  width: 1000, height: 500,
  strokeStyle: 'rgb(0, 0, 0)'
});

function errorCallback (e) {
  alert(e);
  console.log('Reeeejected!', e);
};

function loadSound(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = callback;

  xhr.send();
}

function playSound(ctx, buffer) {
  let source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}


class App {
  constructor() {
    // this.loadSound();
    this.getUserMedia();
  }

  loadSound() {
    loadSound(urls.organ, function(event) {
      let { response } = event.target;

      audioCtx.decodeAudioData(response, function(buffer) {
        // playSound(audioCtx, buffer);
        let source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(visualizer);
        // source.connect(audioCtx.destination);

        visualizer.renderFrequencyData();

        source.start();
      }, errorCallback);
    });
  }

  getUserMedia() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      let source = gotStream(stream);

      source.connect(visualizer);
      visualizer.renderFrequencyData();

    }, errorCallback);
  }
}

new App();