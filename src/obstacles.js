import { damage } from './player.js';

const lanes = [-0.55, 0, 0.55];

export function maybeSpawn(state){
  if (state.frame - state.lastSpawn < 105 + Math.random()*48) return;
  state.lastSpawn = state.frame;
  const roll = Math.random();
  const type = roll < .38 ? 'ramp' : roll < .66 ? 'barrel' : roll < .84 ? 'steps' : 'gap';
  state.objects.push({ type, lane: lanes[Math.floor(Math.random()*lanes.length)], z:1.08, hit:false });
}

export function updateObstacles(state, player){
  for (const obj of state.objects){
    obj.z -= state.speed * 0.00034;
    if (obj.z < .145 && obj.z > .02) collide(obj, player, state);
  }
  state.objects = state.objects.filter(o => o.z > -.08);
}

function collide(obj, player, state){
  if (obj.hit || player.invincible > 0) return;
  const dx = Math.abs(player.x - obj.lane);

  if (obj.type === 'ramp'){
    if (dx < .35 && !player.airborne){
      player.airborne = true;
      player.jumpVel = 18;
      player.jump = 1;
      state.score += 120;
      state.message = 'SALTO +120';
      state.messageTimer = 60;
    }
    return;
  }

  if (obj.type === 'gap'){
    if (dx < .38 && player.jump < 18){ obj.hit = true; damage(player, state, 'CAIDA'); }
    return;
  }

  if (dx < .34 && player.jump < 14){ obj.hit = true; damage(player, state, 'GOLPE'); }
}
