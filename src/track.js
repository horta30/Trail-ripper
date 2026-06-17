export function curveAt(distance, z){
  const d = distance * 0.0032;
  return Math.sin(d + z * 3.1) * 0.52 + Math.sin(d * 1.8 + z * 7.2) * 0.16;
}

export function hillAt(distance, z){
  const d = distance * 0.004;
  return Math.sin(d + z * 5.2) * 34 + Math.sin(d * 1.7 + z * 9.8) * 12;
}

export function project(W, H, distance, x, z){
  const depth = Math.pow(1 - z, 2.18);
  const horizon = 238;
  const center = W / 2 + curveAt(distance, z) * (1 - z) * 560;
  const width = 120 + depth * 1110;
  const y = horizon + depth * (H - horizon + 82) + hillAt(distance, z) * depth;
  return { x:center + x * width * 0.5, y, width, center, depth };
}
