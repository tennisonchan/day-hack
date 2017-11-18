class AudioVisualizer extends AnalyserNode {
  constructor(audioCtx, mount, options = {}) {
    super(audioCtx);

    this.mount = mount;
    this.width = options.width || 500;
    this.height = options.height || 200;
    this.fillStyle = options.fillStyle || 'rgba(255, 255, 255, 0)';
    this.strokeStyle = options.strokeStyle || 'rgb(0, 0, 0)';
    this.lineWidth = options.lineWidth || 2;
  }

  createCanvas() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = this.width;
    canvas.height = this.height;

    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;

    return ctx;
  }

  renderTimeDomainData() {
    let canvasCtx = this.createCanvas();
    let { width, height } = canvasCtx.canvas;
    let dataArray = new Float32Array(this.frequencyBinCount);

    this.mount.appendChild(canvasCtx.canvas);

    requestAnimationFrame(draw.bind(this));

    function draw() {
      let x = 0;
      let slice = dataArray.length;
      this.getFloatTimeDomainData(dataArray);

      for (let i = 0; i < slice; i++) {
        let v = dataArray[i] * 200;
        let y = height / 2 + v;

        if (i === 0) {
          x = 0;
          canvasCtx.clearRect(0, 0, width, height);
          canvasCtx.beginPath();

          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += width / slice;
      }

      canvasCtx.stroke();

      requestAnimationFrame(draw.bind(this));
    }
  }

  renderFrequencyData() {
    let canvasCtx = this.createCanvas();
    let { width, height } = canvasCtx.canvas;
    let dataArray = new Float32Array(this.frequencyBinCount);

    this.mount.appendChild(canvasCtx.canvas);

    this.fftSize = 1024;

    requestAnimationFrame(draw.bind(this));

    function draw() {
      requestAnimationFrame(draw.bind(this));
      this.getFloatFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, width, height);

      let bufferLength = dataArray.length;
      let barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      for(let i = 0; i < bufferLength; i++) {
        if (dataArray[i] === 0) return;
        let barHeight = (dataArray[i] + 140) * 2;

        canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
        canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    }
  }
}

// new AudioDrawer(document.querySelector('canvas'));

// exports = module.exports = AudioDrawer;

// navigator.getUserMedia({audio: true}, function(stream) {
//   var microphone = audioCtx.createMediaStreamSource(stream);
//   var filter = audioCtx.createBiquadFilter();

//   // microphone -> filter -> destination.
//   microphone.connect(filter);
//   filter.connect(audioCtx.destination);
// }, errorCallback);

// var localMediaStream = null;

// function snapshot() {
//   if (localMediaStream) {
//     ctx.drawImage(video, 0, 0);
//     // "image/webp" works in Chrome.
//     // Other browsers will fall back to image/png.
//     document.querySelector('img').src = canvas.toDataURL('image/webp');
//   }
// }

// video.addEventListener('click', snapshot, false);