window.animateId = null;
window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(fn){ return animateId = setTimeout(fn, 1000/60) }

window.cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function(animateId){ clearTimeout(animateId) }

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const { width, height } = canvas;
const dimness = 1.5;
const imgData = ctx.createImageData(width, height);

function makeStaticEffect() {
  for (let pixel = 4 * (width * height - 1); pixel >= 0; pixel -= 4) {
    let r = Math.random();
    imgData.data[pixel] = imgData.data[pixel+1] = imgData.data[pixel+2] = 255 * Math.pow(r, dimness) | 0;
    imgData.data[pixel+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  requestAnimationFrame(makeStaticEffect);
}

makeStaticEffect();
