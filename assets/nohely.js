/* Nohely — character rig built from her own avatar art.
   front: idle (hands in pockets) / wave (free arm) · side: walk (swinging arm + alternating legs) */
(function () {
  const base = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/[^/]*$/, '') : 'assets/';
  const load = n => { const i = new Image(); i.decoding = 'async'; i.src = base + n; return i; };
  const IMG = { idle: load('f_idle.webp'), wbody: load('w_body.webp'), whand: load('w_hand.webp'), up: load('s_up.webp'), arm: load('s_arm.webp'), legs: load('s_legs.webp') };
  const ready = () => Object.values(IMG).every(i => i.complete && i.naturalWidth > 0);
  const SK = '#80463a', SKD = '#55291f', SKL = '#9c5a46', LINE = '#2a1420';
  const FW = 394, HH = 1324, SS = 1.017, SW = 274 * SS, SH = 1302 * SS;   // art units

  function capsule(c, len, w0, w1) {
    c.beginPath(); c.moveTo(-w0 / 2, 0); c.lineTo(-w1 / 2, len); c.arc(0, len, w1 / 2, Math.PI, 0, true); c.lineTo(w0 / 2, 0); c.arc(0, 0, w0 / 2, 0, Math.PI, true); c.closePath();
  }
  function seg(c, len, w0, w1) {
    capsule(c, len, w0, w1);
    const g = c.createLinearGradient(-w0 / 2, 0, w0 / 2, 0); g.addColorStop(0, SKD); g.addColorStop(.4, SK); g.addColorStop(.7, SKL); g.addColorStop(1, SKD);
    c.fillStyle = g; c.fill(); c.lineWidth = 3; c.strokeStyle = LINE; c.stroke();
  }
  function hand(c) {
    for (let i = 0; i < 4; i++) { c.save(); c.translate(-12 + i * 8, 40); c.rotate(-0.22 + i * 0.15); seg(c, 22 - Math.abs(i - 1.5) * 3, 9, 8); c.restore(); }
    c.save(); c.translate(-18, 16); c.rotate(0.95); seg(c, 22, 10, 8); c.restore();
    c.beginPath(); c.ellipse(0, 20, 21, 26, 0, 0, Math.PI * 2); c.fillStyle = SK; c.fill(); c.lineWidth = 3; c.strokeStyle = LINE; c.stroke();
  }
  function arm(c, a1, a2) {
    c.save(); c.translate(350, 452); c.rotate(a1); seg(c, 150, 58, 50);
    c.translate(0, 146); c.rotate(a2); seg(c, 136, 50, 42); c.translate(0, 130); hand(c); c.restore();
  }
  /* wave pose (her own art): body + hand pivoting at the wrist */
  const WS = 0.81, WX = -125, WY = 0, WW = 555 * WS, WH = 1635 * WS, PX = WX + 132 * WS, PY = WY + 412 * WS;
  function drawFront(c, t, w) {
    const br = Math.sin(t * 2) * 1;
    if (w < 0.5) { c.drawImage(IMG.idle, 0, br, FW, HH); return; }
    c.drawImage(IMG.wbody, WX, WY + br, WW, WH);
    c.save(); c.translate(PX, PY + br); c.rotate(Math.sin(t * 9) * 0.22 * Math.min(1, (w - 0.5) * 3)); c.translate(-PX, -PY - br);
    c.drawImage(IMG.whand, WX, WY + br, WW, WH); c.restore();
  }
  function drawSide(c, t, p, sp) {
    const k = 0.2 * sp, a = Math.sin(p) * k;
    const drop = Math.abs(Math.sin(p)) * 8 * sp;
    const LX = 140 * SS, LY = 650 * SS, AX = 115 * SS, AY = 398 * SS;
    const leg = (ang, dark) => { c.save(); c.translate(LX, LY + drop); c.rotate(ang); c.translate(-LX, -LY);
      if (dark) c.filter = 'brightness(0.55)'; c.drawImage(IMG.legs, 0, 0, SW, SH); c.restore(); };
    leg(a, true); leg(-a, false);
    c.save(); c.translate(0, drop - Math.abs(Math.cos(p)) * 3 * sp);
    c.drawImage(IMG.up, 0, 0, SW, SH);
    c.translate(AX, AY); c.rotate(Math.sin(p) * 0.17 * sp); c.translate(-AX, -AY);
    c.drawImage(IMG.arm, 0, 0, SW, SH);
    c.restore();
  }
  /* box = {w,h} px; feet at the bottom, figure centred. s = {mode, t, wave, phase, speed, facing} */
  function draw(c, box, s) {
    if (!ready()) return false;
    const H = 1345, sc = box.h / H, side = s.mode === 'side';
    c.save(); c.clearRect(0, 0, box.w, box.h);
    c.translate(box.w / 2, 0); c.scale(sc * (s.facing || 1), sc); c.translate(side ? -150 : -145, 0);
    if (side) drawSide(c, s.t, s.phase || 0, s.speed == null ? 1 : s.speed); else drawFront(c, s.t, s.wave || 0);
    c.restore(); return true;
  }
  window.Nohely = { draw, ready, aspect: 500 / 1345 };
})();
