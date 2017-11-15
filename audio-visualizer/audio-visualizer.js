const colors = ['#ffe15b', '#f45e58', '#1d7aa2', '#6dc1b3', '#50514f'];

class AudioVisualizer {
  constructor(mount, options = {}) {
    this.contexts = [];
    this.mount = mount;

    this.width = options.width || 500;
    this.height = options.height || 200;
    this.fillStyle = options.fillStyle || 'rgba(255, 255, 255, 1)';
    this.strokeStyle = options.strokeStyle || 'rgb(0, 0, 0)';
    this.lineWidth = options.lineWidth || 3;
  }

  createCanvas(channel) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    this.mount.appendChild(canvas);

    canvas.width = this.width;
    canvas.height = this.height;

    this.contexts[channel] = ctx;

    return ctx;
  }

  visualize(audioBuffer) {
    for(let i = 0; i < audioBuffer.numberOfChannels; i++) {
      let dataArray = audioBuffer.getChannelData(i);
      let ctx = this.createCanvas(i);
      this.dynamicDraw(ctx, dataArray, audioBuffer.sampleRate, i);
    }
  }

  dynamicDraw(ctx, dataArray, sampleRate, channelIndex) {
    let { width, height } = ctx.canvas;
    let { fillStyle } = this;
    let slice = sampleRate / 60;
    let x = 0;
    let i = 0;

    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = colors[channelIndex];

    requestAnimationFrame(draw);

    function draw() {
      for (let j = 0; j < slice; j++) {
        let v = (dataArray[i++] + 1) / 2;
        let y = v * height;

        if (j === 0) {
          x = 0;
          ctx.fillStyle = fillStyle;
          ctx.fillRect(0, 0, width, height);
          ctx.beginPath();

          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += width / slice;
      }

      ctx.stroke();

      if (dataArray[i] !== undefined) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
  }

  staticDraw(dataArray) {
    let bufferLength = dataArray.length;
    let { width, height, ctx } = this;

    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;

    ctx.beginPath();

    let sliceWidth = width * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      let v = (dataArray[i] + 1) / 2;
      let y = v * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height);
    ctx.stroke();
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

// // Not showing vendor prefixes or code that works cross-browser.
// navigator.getUserMedia({video: true}, function(stream) {
//   video.src = window.URL.createObjectURL(stream);
//   localMediaStream = stream;
// }, errorCallback);