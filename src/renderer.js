import { project } from './track.js';
import { drawHUD, drawGameOver } from './ui.js';

export function render(ctx, W, H, state, player){
  const sx = state.shake ? (Math.random()-.5)*state.shake : 0;
  const sy = state.shake ? (Math.random()-.5)*state.shake : 0;
  ctx.save(); ctx.translate(sx, sy);
  drawSky(ctx, W, H, state);
  drawUrban(ctx, W, H, state);
  drawRoad(ctx, W, H, state);
  [...state.objects].sort((a,b)=>b.z-a.z).forEach(o=>drawObject(ctx, W, H, state, o));
  drawBike(ctx, W, H, state, player);
  drawHUD(ctx, W, H, state, player);
  if(state.gameOver) drawGameOver(ctx, W, H, state);
  ctx.restore();
}

function drawSky(ctx,W,H,state){
  const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#66b9ef'); g.addColorStop(.45,'#c7e9ff'); g.addColorStop(1,'#f2d5a4');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2479aa'; ctx.fillRect(0,222,W,78);
  ctx.fillStyle='#255066'; ctx.beginPath(); ctx.moveTo(0,240); ctx.lineTo(180,190); ctx.lineTo(390,238); ctx.lineTo(620,168); ctx.lineTo(820,238); ctx.lineTo(1050,185); ctx.lineTo(W,235); ctx.lineTo(W,305); ctx.lineTo(0,305); ctx.closePath(); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.7)';
  for(let i=0;i<8;i++){ const x=(i*190-state.frame*.22)%1450-90, y=62+(i%3)*38; ctx.fillRect(x,y,78,12); ctx.fillRect(x+22,y-10,42,15); }
}

function drawUrban(ctx,W,H,state){
  for(let side of [-1,1]) for(let i=0;i<9;i++){
    const z=.16+i*.095, base=project(W,H,state.distance,side*1.16,z), d=base.depth;
    const w=d*(95+(i%3)*18), h=d*(165+(i%4)*45);
    const x=base.x-(side<0?w:0), y=base.y-h;
    const colors=['#d7684d','#e3b85c','#58a0bd','#92b76a','#c78367','#bc5c79'];
    ctx.fillStyle=colors[(i+(side>0?2:0))%colors.length]; ctx.fillRect(x,y,w,h);
    ctx.fillStyle='rgba(0,0,0,.22)'; ctx.fillRect(x,y,w,h*.15);
    ctx.fillStyle='#2e3642';
    for(let k=0;k<3;k++){ ctx.fillRect(x+w*.18+k*w*.24,y+h*.28,Math.max(4,d*18),Math.max(4,d*24)); ctx.fillRect(x+w*.18+k*w*.24,y+h*.58,Math.max(4,d*18),Math.max(4,d*24)); }
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(x,y-d*14,w,d*14);
  }
  ctx.strokeStyle='rgba(25,25,25,.45)'; ctx.lineWidth=2;
  for(let i=0;i<6;i++){ const y=115+i*22; ctx.beginPath(); ctx.moveTo(0,y+Math.sin(state.frame*.01+i)*6); ctx.quadraticCurveTo(W/2,y+42+Math.sin(state.frame*.02+i)*8,W,y+Math.cos(state.frame*.01+i)*6); ctx.stroke(); }
}

function drawRoad(ctx,W,H,state){
  for(let i=30;i>=0;i--){
    const z1=i/31,z2=(i+1)/31;
    const l1=project(W,H,state.distance,-1,z1), r1=project(W,H,state.distance,1,z1), r2=project(W,H,state.distance,1,z2), l2=project(W,H,state.distance,-1,z2);
    poly(ctx,[l1,r1,r2,l2],i%2===0?'#8d877d':'#9d968b');
    const lc1=project(W,H,state.distance,-1.05,z1), lc2=project(W,H,state.distance,-1.05,z2), rc1=project(W,H,state.distance,1.05,z1), rc2=project(W,H,state.distance,1.05,z2);
    ctx.strokeStyle=i%2===0?'#e7d9b9':'#b95548'; ctx.lineWidth=Math.max(2,l1.depth*9);
    ctx.beginPath(); ctx.moveTo(lc1.x,lc1.y); ctx.lineTo(lc2.x,lc2.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rc1.x,rc1.y); ctx.lineTo(rc2.x,rc2.y); ctx.stroke();
    if(i%6<3){ const m1=project(W,H,state.distance,0,z1), m2=project(W,H,state.distance,0,z2); ctx.strokeStyle='#f3d34e'; ctx.lineWidth=Math.max(1,l1.depth*4); ctx.beginPath(); ctx.moveTo(m1.x,m1.y); ctx.lineTo(m2.x,m2.y); ctx.stroke(); }
  }
}

function drawObject(ctx,W,H,state,obj){
  const p=project(W,H,state.distance,obj.lane,obj.z), s=p.depth; if(s<=0) return;
  ctx.save(); ctx.translate(p.x,p.y); if(obj.hit) ctx.globalAlpha=.35; ctx.scale(s,s);
  if(obj.type==='ramp'){ ctx.fillStyle='#4a8ca5'; ctx.fillRect(-72,-26,144,52); ctx.fillStyle='#25596f'; ctx.beginPath(); ctx.moveTo(-72,26); ctx.lineTo(72,26); ctx.lineTo(42,-26); ctx.lineTo(-72,-26); ctx.closePath(); ctx.fill(); ctx.strokeStyle='#1d3947'; ctx.lineWidth=5; ctx.strokeRect(-72,-26,144,52); }
  if(obj.type==='barrel'){ ctx.fillStyle='#a04833'; ctx.fillRect(-34,-82,68,82); ctx.fillStyle='#5f2921'; ctx.fillRect(-40,-88,80,12); ctx.fillRect(-40,-45,80,10); ctx.fillRect(-40,-5,80,10); }
  if(obj.type==='steps'){ ctx.fillStyle='#c9baa0'; for(let i=0;i<5;i++) ctx.fillRect(-78+i*9,-18-i*17,156-i*18,16); ctx.strokeStyle='#7b6d5b'; ctx.lineWidth=3; ctx.strokeRect(-78,-86,156,84); }
  if(obj.type==='gap'){ ctx.fillStyle='#1b1b1b'; ctx.fillRect(-92,-6,184,38); ctx.fillStyle='#d0b58b'; ctx.fillRect(-120,-20,60,20); ctx.fillRect(60,-20,60,20); }
  ctx.restore();
}

function drawBike(ctx,W,H,state,player){
  const bob=Math.sin(state.frame*.18)*2-player.jump*.26;
  const lean=player.lean;
  ctx.save(); ctx.translate(W/2,610+bob); ctx.rotate(lean*.07);
  ctx.strokeStyle='#101010'; ctx.lineWidth=18; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-320+lean*26,4); ctx.quadraticCurveTo(0,-42,320+lean*26,4); ctx.stroke();
  ctx.strokeStyle='#222'; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(lean*18,96); ctx.stroke();
  ctx.fillStyle='#191919'; ctx.fillRect(-56,-22,112,34);
  ctx.fillStyle='#1b6fb5'; ctx.fillRect(-37,12,74,90);
  ctx.fillStyle='#c38554'; ctx.fillRect(-640,-18,330,78); ctx.fillRect(310,-18,330,78);
  ctx.fillStyle='#1b5ea2'; ctx.fillRect(-375,-42,90,70); ctx.fillRect(285,-42,90,70);
  ctx.restore();
}

function poly(ctx,pts,fill){ ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y); for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); }
