import { Channel } from './channel.js';
import { CHANNEL_KEYMAP, TUNE_KEYMAP, SPACE_KEYCODE } from './key-map.js';
const audioCtx = new (window.AudioContext || window.webkitAudioContext);
const fs = [500, 750, 1000, 1500, 2000];
class App {
  constructor() {
    this.channels = [];
    this.currentChannelId = 0;
    this.mute = true;

    this.addChannel();
    this.addChannel();
    this.addChannel();
    this.addChannel();
    this.addChannel();
    this.addListeners();
  }

  getCurrentChannel() {
    return this.channels[this.currentChannelId];
  }

  addChannel() {
    let channelId = this.channels.length;
    let newChannel = new Channel(audioCtx, channelId, { frequency: fs[channelId] });
    this.channels.push(newChannel);
    this.currentChannelId = channelId;

    newChannel.toggleMute(this.mute);
  }

  addListeners() {
    document.addEventListener('keydown', this.keydownHander.bind(this));
    document.getElementById('addChannel').addEventListener('click', this.addChannel.bind(this));
    document.getElementById('mute-button').addEventListener('click', this.toggleMute.bind(this));
  }

  toggleMute() {
    this.mute = !this.mute;
    this.channels.forEach((channel) => {
      channel.toggleMute(this.mute);
    });
  }

  keydownHander(evt) {
    if (evt.keyCode === SPACE_KEYCODE) {
      this.mute = !this.mute;

      this.channels.forEach((channel) => {
        channel.toggleMute(this.mute);
      });
    }

    let tune = TUNE_KEYMAP[evt.keyCode];
    if (tune) {
      let currentChannel = this.getCurrentChannel();
      currentChannel.setFrequency(tune);
    }

    let channelId = CHANNEL_KEYMAP[evt.keyCode];
    if (channelId !== undefined && this.channels[channelId]) {
      this.currentChannelId = channelId;
    }
  }
}

window.app = new App();