export const input = { left:false, right:false, jump:false, trickLeft:false, trickRight:false, restart:false };

const map = {
  ArrowLeft:'left', KeyA:'left',
  ArrowRight:'right', KeyD:'right',
  Space:'jump',
  KeyQ:'trickLeft',
  KeyE:'trickRight',
  KeyR:'restart'
};

window.addEventListener('keydown', e => {
  const key = map[e.code];
  if (!key) return;
  input[key] = true;
  e.preventDefault();
});

window.addEventListener('keyup', e => {
  const key = map[e.code];
  if (!key) return;
  input[key] = false;
});
