let canvas, ctx;
var xv = -1
var yv = 0;
var px = py = 10;
var ax = 1;
var ay = 10;
var gs = tc = 20;
var trail = [];
var tail = 5;
var dir = 37;
var difficulty = 15;
var timeoutId = 0;

window.onload = function() {
  canvas = document.getElementById('c');
  ctx = canvas.getContext('2d');
  document.addEventListener('keydown', onKeydown);
  for(let i = 0; i < tail; i++) {
    trail.unshift({ x: px + i, y: py });
  }

  timeout();
}

function timeout() {
  game();
  timeoutId = setTimeout(timeout, 1000 / (difficulty + tail / 2));
}

function stop() {
  clearTimeout(timeoutId);
}


function game() {
  px+=xv;
  py+=yv;

  if(px >= tc) {
    px = 0;
  }
  if(px < 0) {
    px = tc - 1;
  }
  if(py >= tc) {
    py = 0;
  }
  if(py < 0) {
    py = tc - 1;
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(ax * gs, ay * gs, gs -2, gs -2);

  ctx.fillStyle = 'lime';
  for (let i = 0; i < trail.length; i++) {
    ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs -2, gs -2);

    if(trail[i].x === px && trail[i].y === py) {
      tail = 5;
    }
  }

  if (px === ax && py === ay) {
    tail++;
    ax = Math.random() * tc | 0;
    ay = Math.random() * tc | 0;
  }

  trail.push({ x: px, y: py });

  while(trail.length > tail) {
    trail.shift();
  }
}

function onKeydown(evt) {
  switch(evt.keyCode) {
    case 37:
      if(dir !== 39) {
        xv=-1;yv=0;
        dir=evt.keyCode;
      }
      break;
    case 38:
      if(dir !== 40) {
        xv=0;yv=-1;
        dir=evt.keyCode;
      }
      break;
    case 39:
      if(dir !== 37) {
        xv=1;yv=0;
        dir=evt.keyCode;
      }
      break;
    case 40:
      if(dir !== 38) {
        xv=0;yv=1;
        dir=evt.keyCode;
      }
      break;
  }
}
