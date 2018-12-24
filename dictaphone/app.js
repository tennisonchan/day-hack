// set up basic variables for app

const recordEl = document.querySelector('.record');
const stopEl = document.querySelector('.stop');
const soundClipsEl = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSectionEl = document.querySelector('.main-controls');
// disable stop button while not recording

const constraints = { audio: true };
stopEl.disabled = true;

// visualiser setup - create web audio api context and canvas

const audioCtx = new (window.AudioContext || webkitAudioContext)();
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (!navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia not supported on your browser!');

}

function app () {
  var chunks = [];

  function onSuccess (stream) {
    var mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    recordEl.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      recordEl.style.background = "red";

      stopEl.disabled = false;
      recordEl.disabled = true;
    }

    stopEl.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      recordEl.style.background = "";
      recordEl.style.color = "";
      // mediaRecorder.requestData();

      stopEl.disabled = true;
      recordEl.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      console.log(clipName);
      var clipContainer = document.createElement('article');
      var clipLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClipsEl.appendChild(clipContainer);

      audio.controls = true;
      var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        var existingName = clipLabel.textContent;
        var newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      console.log('ondataavailable', e.data);
      chunks.push(e.data);
    }
  }

  function onError (err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
}

function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);
  width = canvas.width
  height = canvas.height;

  draw()

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, width, height);

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = width * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * height / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(width, height);
    canvasCtx.stroke();
  }
}

window.onresize = function() {
  canvas.width = mainSectionEl.offsetWidth;
}

app();

window.onresize();