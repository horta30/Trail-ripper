import { input } from './input.js';
import { createPlayer, updatePlayer, damage } from './player.js';
import { maybeSpawn, updateObstacles } from './obstacles.js';
import { render } from './renderer.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

let player = createPlayer();
let state = createState();

function createState(){
  return { frame:0, distance:0, speed:62, score:0, time:90, gameOver:false, shake:0, lastSpawn:0, objects:[], message:'', messageTimer:0 };
}

function reset(){ player = createPlayer(); state = createState(); }

function update(){
  if(state.gameOver){ if(input.restart) reset(); return; }

  state.frame++;
  state.distance += state.speed;
  state.time -= 1/60;
  if(state.time <= 0) state.gameOver = true;

  updatePlayer(player, input, state);

  if(Math.abs(player.x) > .88){
    state.speed = Math.max(42, state.speed - .05);
    if(state.frame % 55 === 0) damage(player, state, 'FUERA DE LINEA');
  } else {
    state.speed = Math.min(74, state.speed + .012);
  }

  maybeSpawn(state);
  updateObstacles(state, player);

  state.score += Math.floor(state.speed/32);
  state.shake = Math.max(0, state.shake-1);
  state.messageTimer = Math.max(0, state.messageTimer-1);
}

function loop(){ update(); render(ctx, W, H, state, player); requestAnimationFrame(loop); }
loop();
