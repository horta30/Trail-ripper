export function drawHUD(ctx, W, H, state, player){
  box(ctx, 28, 24, 190, 86, 'TIEMPO', Math.max(0, state.time).toFixed(1));
  box(ctx, W/2-115, 22, 230, 88, 'PUNTOS', state.score);
  box(ctx, W-218, 24, 190, 86, 'STAGE', '1/5');

  ctx.fillStyle='rgba(0,0,0,.68)'; ctx.fillRect(28,H-84,160,54);
  ctx.fillStyle='#f4c247'; ctx.font='bold 20px Arial'; ctx.textAlign='left'; ctx.fillText('VIDAS',48,H-54);
  for(let i=0;i<3;i++){ ctx.fillStyle=i<player.lives?'#e2252b':'#3b3b3b'; ctx.beginPath(); ctx.arc(62+i*38,H-34,13,0,Math.PI*2); ctx.fill(); }

  ctx.fillStyle='rgba(0,0,0,.68)'; ctx.fillRect(W-214,H-88,186,58);
  ctx.fillStyle='#f4c247'; ctx.font='bold 19px Arial'; ctx.fillText('VELOCIDAD',W-196,H-60);
  ctx.fillStyle='#fff'; ctx.font='bold 31px Arial'; ctx.fillText(Math.round(state.speed)+' KM/H',W-196,H-34);

  if(state.messageTimer>0 && state.message){
    ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(42,132,245,72);
    ctx.fillStyle='#f4c247'; ctx.font='bold 21px Arial'; ctx.fillText('EVENTO',62,162);
    ctx.fillStyle='#fff'; ctx.font='bold 26px Arial'; ctx.fillText(state.message,62,194);
  }

  ctx.fillStyle='rgba(0,0,0,.72)'; ctx.fillRect(0,H-28,W,28);
  ctx.fillStyle='#fff'; ctx.font='bold 19px Arial'; ctx.textAlign='left';
  ctx.fillText('VALPARAISO CERRO ABAJO — TRAIL RIPPER',24,H-8);
}

export function drawGameOver(ctx, W, H, state){
  ctx.fillStyle='rgba(0,0,0,.78)'; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center'; ctx.fillStyle='#f4c247'; ctx.font='bold 68px Arial'; ctx.fillText('GAME OVER',W/2,H/2-42);
  ctx.fillStyle='#fff'; ctx.font='bold 30px Arial'; ctx.fillText('Puntos: '+state.score,W/2,H/2+10);
  ctx.font='22px Arial'; ctx.fillText('Presiona R para reiniciar',W/2,H/2+58);
}

function box(ctx,x,y,w,h,label,value){
  ctx.fillStyle='rgba(0,0,0,.72)'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#d9aa35'; ctx.lineWidth=3; ctx.strokeRect(x+2,y+2,w-4,h-4);
  ctx.textAlign='center'; ctx.fillStyle='#f4c247'; ctx.font='bold 22px Arial'; ctx.fillText(label,x+w/2,y+28);
  ctx.fillStyle='#fff'; ctx.font='bold 38px Arial'; ctx.fillText(value,x+w/2,y+h-18);
}
