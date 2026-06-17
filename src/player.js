export function createPlayer(){
  return { x:0, lean:0, jump:0, jumpVel:0, airborne:false, invincible:0, lives:3 };
}

export function updatePlayer(player, input, state){
  const steer = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  player.x = clamp(player.x + steer * 0.036, -1, 1);
  player.lean += (steer - player.lean) * 0.14;

  if (input.jump && !player.airborne){
    player.airborne = true;
    player.jumpVel = 16.5;
    player.jump = 1;
  }

  if (player.airborne){
    player.jump += player.jumpVel;
    player.jumpVel -= 1.03;

    if (player.jump > 16 && player.jumpVel > -8){
      if (input.trickLeft){
        state.score += 12;
        state.message = 'BACKFLIP +12';
        state.messageTimer = 55;
      }
      if (input.trickRight){
        state.score += 10;
        state.message = 'WHIP +10';
        state.messageTimer = 55;
      }
    }

    if (player.jump <= 0){
      player.jump = 0;
      player.jumpVel = 0;
      player.airborne = false;
    }
  }

  player.invincible = Math.max(0, player.invincible - 1);
}

export function damage(player, state, text='GOLPE'){
  if (player.invincible > 0 || state.gameOver) return;
  player.lives--;
  player.invincible = 70;
  state.speed = Math.max(42, state.speed - 12);
  state.shake = 18;
  state.message = text;
  state.messageTimer = 65;
  if (player.lives <= 0) state.gameOver = true;
}

function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
