
export class Channel {
  constructor(audioCtx, id, options) {
    this.id = id;
    this.frequency = options.frequency || 500;
    this.mute = true;

    this.oscillatorNode = audioCtx.createOscillator();
    this.gainNode = audioCtx.createGain();

    this.oscillatorNode.connect(this.gainNode);
    this.gainNode.connect(audioCtx.destination)
    this.oscillatorNode.start();
    this.oscillatorNode.frequency.value = this.frequency;
    this.gainNode.gain.value = 0;

    this.renderDisplay();
    this.displayFrequency();
  }

  toggleMute(isMute) {
    this.mute = isMute;
    this.gainNode.gain.value = isMute ? 0 : 0.8;
  }

  setFrequency(tune) {
    this.frequency += tune;
    this.oscillatorNode.frequency.value = this.frequency;
    this.displayFrequency();
  }

  renderDisplay() {
    let id = `channel-${this.id}:frequency`;
    let div = document.getElementById(id);

    if (!div) {
      let text = document.createTextNode('Frequency: ');
      let span = document.createElement('span');
      let muteButton = document.createElement('button');
      span.id = `channel-${this.id}:frequency`;
      muteButton.textContent = 'mute';
      div = document.createElement('div');
      div.appendChild(text);
      div.appendChild(span);
      div.appendChild(muteButton);

      muteButton.addEventListener('click', () => {
        this.toggleMute(!this.mute);
      });
      document.getElementById('channels').appendChild(div);
    }
  }

  displayFrequency() {
    document.getElementById(`channel-${this.id}:frequency`).innerHTML = this.frequency.toFixed(2);
  }
}