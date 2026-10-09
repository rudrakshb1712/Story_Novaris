/**
 * ============================================================================
 * AVENGERS: THE LAST DROP PROTOCOL — PRODUCTION APPLICATION SCRIPT
 * Mechanics: Iron Man Vector Cursor, Thruster Physics, Procedural Web Audio,
 * Dynamic Generative Canvas Viewport, Simulator & Tactical Map Engine
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL AUDIO DEPENDENCIES)
     ========================================================================== */
  class TacticalAudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initAudioContext();
    }

    initAudioContext() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.ctx) {
        this.ctx = new AudioCtx();
      }
    }

    ensureContext() {
      if (!this.ctx) this.initAudioContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      return !this.muted;
    }

    // 1. UI Button Click: Sine chirp 800 Hz -> 1200 Hz over 0.06s
    playClick() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    }

    // 2. Slider Adjustment: Subtle high-frequency tick (1500 Hz for 0.02s)
    playTick() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    }

    // 3. Emergency Alert: Dual alternating frequency warble (440 Hz / 880 Hz)
    playAlert() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      osc.frequency.setValueAtTime(440, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    }

    // 4. Repulsor Click: Resonant low-to-high frequency sweep with soft decay
    playRepulsor() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    }

    // 5. Victory Protocol Chime: Harmonious arpeggio chords
    playVictory() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.14, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.65);
      });
    }

    // 6. 8-Bit Retro Coin Pickup (Two-tone arpeggio)
    playCoin() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }

    // 7. 8-Bit Laser Blast (Pitch-drop sawtooth)
    playLaser() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.14);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    // 8. 8-Bit Error Buzz (Low dissonant buzz)
    playError() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
    }

    // 9. Node Chime Tone (for Simon-Says sequence)
    playTone(freq = 440, duration = 0.2) {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    // 10. 8-Bit Victory Fanfare Arpeggio
    playStageClear() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.10 }, // C5
        { f: 659.25, d: 0.10 }, // E5
        { f: 783.99, d: 0.10 }, // G5
        { f: 1046.50, d: 0.14 }, // C6
        { f: 1318.51, d: 0.35 }  // E6
      ];
      let offset = 0;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + offset;
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, noteStart);
        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + n.d + 0.05);
        offset += n.d * 0.85;
      });
    }
  }

  const soundFX = new TacticalAudioSynthesizer();
  window.soundFX = soundFX; // Export for inline button test calls


  /* ==========================================================================
     2. CUSTOM FLYING IRON MAN CURSOR & PARTICLE THRUSTER PHYSICS
     ========================================================================== */
  const cursorSprite = document.getElementById('ironman-cursor');
  const fxCanvas = document.getElementById('cursor-fx-canvas');
  const fxCtx = fxCanvas.getContext('2d');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let currentAngle = 0;
  let targetAngle = 0;
  const lerpFactor = 0.18;

  // Particle Thrusters System
  const particles = [];
  const shockwaves = [];

  class ThrusterParticle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = Math.random() * 3 + 2.5;
      this.initialRadius = this.radius;
      this.life = 1.0;
      this.decay = Math.random() * 0.04 + 0.035;
      // Color interpolation: #00F0FF -> #FF9900 -> #FF3300
      this.heat = 1.0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.radius = this.initialRadius * Math.max(0, this.life);
      this.heat = this.life;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.life;

      // Color based on heat
      let color = '#00F0FF';
      if (this.heat < 0.4) {
        color = '#FF3300';
      } else if (this.heat < 0.75) {
        color = '#FF9900';
      }

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class RepulsorShockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 8;
      this.maxRadius = 80;
      this.alpha = 1.0;
      this.speed = 4.5;
    }

    update() {
      this.radius += this.speed;
      this.alpha = 1.0 - this.radius / this.maxRadius;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function resizeFxCanvas() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFxCanvas);
  resizeFxCanvas();

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mousedown', (e) => {
    shockwaves.push(new RepulsorShockwave(e.clientX, e.clientY));
    soundFX.playRepulsor();
    if (cursorSprite) cursorSprite.classList.add('cursor-active');
  });

  window.addEventListener('mouseup', () => {
    if (cursorSprite) cursorSprite.classList.remove('cursor-active');
  });

  function updateCursorAndFX() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    cursorX += dx * lerpFactor;
    cursorY += dy * lerpFactor;

    // Calculate heading angle if moving significantly
    if (speed > 1.2) {
      targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
      // Smooth angle interpolation
      let angleDiff = targetAngle - currentAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      currentAngle += angleDiff * 0.22;
    }

    if (cursorSprite) {
      cursorSprite.style.left = `${cursorX}px`;
      cursorSprite.style.top = `${cursorY}px`;
      cursorSprite.style.transform = `translate(-50%, -50%) rotate(${currentAngle}rad)`;
    }

    // Spawn boot thruster exhaust particles behind suit
    const thrusterOffset = 24;
    const exhaustAngle = currentAngle + Math.PI / 2;
    const leftBootX = cursorX + Math.cos(exhaustAngle - 0.4) * thrusterOffset;
    const leftBootY = cursorY + Math.sin(exhaustAngle - 0.4) * thrusterOffset;
    const rightBootX = cursorX + Math.cos(exhaustAngle + 0.4) * thrusterOffset;
    const rightBootY = cursorY + Math.sin(exhaustAngle + 0.4) * thrusterOffset;

    const particleCount = speed > 4 ? 3 : 1;
    for (let i = 0; i < particleCount; i++) {
      const spread = (Math.random() - 0.5) * 1.5;
      const kickX = -Math.sin(currentAngle) * (Math.random() * 4 + 2) + spread;
      const kickY = Math.cos(currentAngle) * (Math.random() * 4 + 2) + spread;

      particles.push(new ThrusterParticle(leftBootX, leftBootY, kickX, kickY));
      particles.push(new ThrusterParticle(rightBootX, rightBootY, kickX, kickY));
    }

    // Update & Render FX Canvas
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      shockwaves[i].update();
      shockwaves[i].draw(fxCtx);
      if (shockwaves[i].alpha <= 0) shockwaves.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(fxCtx);
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(updateCursorAndFX);
  }
  requestAnimationFrame(updateCursorAndFX);


  /* ==========================================================================
     3. VERTICAL ENVIRONMENT TRANSITION (APPLE-STYLE SCROLL ENGINE)
     ========================================================================== */
  const stageLayer1 = document.getElementById('stage-layer-1');
  const stageLayer2 = document.getElementById('stage-layer-2');
  const stageLayer3 = document.getElementById('stage-layer-3');

  const hudScrollDepth = document.getElementById('hud-scroll-depth');
  const hudDistrictName = document.getElementById('hud-district-name');
  const hudGridStatus = document.getElementById('hud-grid-status');

  const bgCanvas = document.getElementById('bg-environment-canvas');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;

  function resizeBgCanvas() {
    if (bgCanvas) {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  // Floating background atmospheric motes
  const bgAtmosphereParticles = Array.from({ length: 35 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    speedY: Math.random() * 0.35 + 0.1,
    alpha: Math.random() * 0.4 + 0.15
  }));

  let targetProgress = 0;
  let currentProgress = 0;

  function updateScrollTarget() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = docHeight > 0 ? Math.min(1.0, Math.max(0.0, window.scrollY / docHeight)) : 0;
  }
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  updateScrollTarget();

  function animateStageAndEnvironment() {
    // Smooth Apple-style lerp damping (0.12)
    currentProgress += (targetProgress - currentProgress) * 0.12;
    const p = currentProgress;

    // 1. Apple-Style 3-Layer Scroll Transitions
    let op1 = 0, scale1 = 1.0, transY1 = 0;
    let op2 = 0, scale2 = 1.0, transY2 = 0;
    let op3 = 0, scale3 = 1.0, transY3 = 0;

    if (p <= 0.35) {
      // Progress 0.00 – 0.35 (Upper Novaris):
      // Layer 1 (uppertown): opacity = 1, gently scaling from scale(1.06) down to scale(1.0)
      // Layer 2 and Layer 3: opacity = 0
      const t = p / 0.35;
      op1 = 1.0;
      scale1 = 1.06 - (t * 0.06);
      transY1 = 0;

      op2 = 0;
      scale2 = 1.04;
      transY2 = 35;

      op3 = 0;
      scale3 = 0.96;
      transY3 = 0;
    } else if (p <= 0.70) {
      // Progress 0.35 – 0.70 (The Undertown Descent):
      // Smooth cross-fade: Layer 1 fades from 1 to 0
      // Layer 2 (undertown): fades in from 0 to 1 with subtle downward translation (translateY)
      // Layer 3: opacity = 0
      const t = (p - 0.35) / 0.35;
      op1 = Math.max(0, 1.0 - t);
      scale1 = 1.0 - (t * 0.03);
      transY1 = -t * 20;

      op2 = Math.min(1.0, t);
      scale2 = 1.04 - (t * 0.04);
      transY2 = (1.0 - t) * 35; // Simulates descending underground into Shantinagar

      op3 = 0;
      scale3 = 0.96;
      transY3 = 0;
    } else {
      // Progress 0.70 – 1.00 (The Exploded Engine Core):
      // Layer 2 fades out to 0.1
      // Layer 3 (exploded_core): fades in to opacity = 1, expanding smoothly (scale(0.96) to scale(1.1))
      const t = Math.min(1.0, (p - 0.70) / 0.30);
      op1 = 0;
      scale1 = 0.97;
      transY1 = -20;

      op2 = Math.max(0.1, 1.0 - (t * 0.90));
      scale2 = 1.0 - (t * 0.04);
      transY2 = -t * 15;

      op3 = Math.min(1.0, t);
      scale3 = 0.96 + (t * 0.14); // 0.96 -> 1.10 Apple-style exploded view
      transY3 = 0;
    }

    // Apply computed matrix styles to image layers
    if (stageLayer1) {
      stageLayer1.style.opacity = op1.toFixed(3);
      stageLayer1.style.transform = `scale(${scale1.toFixed(4)}) translateY(${transY1.toFixed(1)}px)`;
    }
    if (stageLayer2) {
      stageLayer2.style.opacity = op2.toFixed(3);
      stageLayer2.style.transform = `scale(${scale2.toFixed(4)}) translateY(${transY2.toFixed(1)}px)`;
    }
    if (stageLayer3) {
      stageLayer3.style.opacity = op3.toFixed(3);
      stageLayer3.style.transform = `scale(${scale3.toFixed(4)}) translateY(${transY3.toFixed(1)}px)`;
    }

    // 2. HUD Telemetry & District Status Synchronization
    const roundedPercent = Math.round(targetProgress * 100);
    if (hudScrollDepth) hudScrollDepth.textContent = `${roundedPercent}%`;

    if (p <= 0.35) {
      if (hudDistrictName) hudDistrictName.textContent = 'MERIDIAN HEIGHTS';
      if (hudGridStatus) {
        hudGridStatus.textContent = 'SURPLUS FLOW (99.8%)';
        hudGridStatus.className = 'font-bold text-cyberCyan';
      }
    } else if (p <= 0.70) {
      if (hudDistrictName) hudDistrictName.textContent = 'CONDUIT SUB-NET 12 // SHANTINAGAR';
      if (hudGridStatus) {
        hudGridStatus.textContent = 'PRESSURE IRREGULARITY (420 PSI)';
        hudGridStatus.className = 'font-bold text-amber-400';
      }
    } else {
      if (hudDistrictName) hudDistrictName.textContent = 'SUB-LEVEL 7 // THIRST ENGINE CORE';
      if (hudGridStatus) {
        hudGridStatus.textContent = 'CORE DECONSTRUCTION ACTIVE';
        hudGridStatus.className = 'font-bold text-alarmCrimson';
      }
    }

    // 3. Ambient Atmospheric Particle Canvas (Motes floating over photorealistic art)
    if (bgCtx && bgCanvas) {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      const w = bgCanvas.width;
      const h = bgCanvas.height;

      let moteColor = '#00F0FF';
      if (p > 0.70) {
        moteColor = '#C77DFF';
      } else if (p > 0.35) {
        moteColor = '#F59E0B';
      }

      for (let pt of bgAtmosphereParticles) {
        pt.y -= pt.speedY;
        if (pt.y < 0) pt.y = h;

        bgCtx.save();
        bgCtx.globalAlpha = pt.alpha;
        bgCtx.fillStyle = moteColor;
        bgCtx.shadowColor = moteColor;
        bgCtx.shadowBlur = 6;
        bgCtx.beginPath();
        bgCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
      }
    }

    requestAnimationFrame(animateStageAndEnvironment);
  }
  requestAnimationFrame(animateStageAndEnvironment);


  /* ==========================================================================
     4. MODULE A: "THIRST ENGINE" WATER ALLOCATION SIMULATOR
     ========================================================================== */
  const meridianSlider = document.getElementById('meridian-slider');
  const shantinagarSlider = document.getElementById('shantinagar-slider');
  const throttleSlider = document.getElementById('throttle-slider');

  const meridianVal = document.getElementById('meridian-val');
  const shantinagarVal = document.getElementById('shantinagar-val');
  const throttleVal = document.getElementById('throttle-val');

  const unrestScore = document.getElementById('unrest-score');
  const unrestBar = document.getElementById('unrest-bar');
  const simAlertBadge = document.getElementById('sim-alert-badge');

  const stressScore = document.getElementById('stress-score');
  const stressBar = document.getElementById('stress-bar');
  const pipeSteamWarning = document.getElementById('pipe-steam-warning');

  const healthScore = document.getElementById('health-score');
  const healthBar = document.getElementById('health-bar');
  const protocolStatusBox = document.getElementById('protocol-status-box');

  const executeProtocolBtn = document.getElementById('execute-protocol-btn');
  const simulatorCard = document.getElementById('simulator-card');

  function calculateSimulation() {
    const meridian = parseInt(meridianSlider.value, 10);
    const shantinagar = parseInt(shantinagarSlider.value, 10);
    const throttle = parseInt(throttleSlider.value, 10);

    // Update Label Displays
    if (meridianVal) meridianVal.textContent = `${meridian}%`;
    if (shantinagarVal) shantinagarVal.textContent = `${shantinagar}%`;
    if (throttleVal) throttleVal.textContent = `${throttle}%`;

    // Dynamic Formulas
    // 1. Social Unrest Index = Math.max(0, Math.min(100, Math.round((80 - ShantinagarAllocation) * 1.5)))
    const unrest = Math.max(0, Math.min(100, Math.round((80 - shantinagar) * 1.5)));

    // 2. Infrastructure Stress = Math.round((Meridian + Shantinagar) * 0.65 * (ExtractionThrottle / 50))
    const stress = Math.max(0, Math.min(100, Math.round((meridian + shantinagar) * 0.65 * (throttle / 50))));

    // 3. Public Health Stability = Math.round((Shantinagar * 0.7) + (30 - SocialUnrest * 0.3))
    const health = Math.max(0, Math.min(100, Math.round(shantinagar * 0.7 + (30 - unrest * 0.3))));

    // Render Metrics
    if (unrestScore) unrestScore.textContent = `${unrest}%`;
    if (unrestBar) unrestBar.style.width = `${unrest}%`;

    if (stressScore) stressScore.textContent = `${stress}%`;
    if (stressBar) stressBar.style.width = `${stress}%`;

    if (healthScore) healthScore.textContent = `${health}%`;
    if (healthBar) healthBar.style.width = `${health}%`;

    // Alerts
    if (unrest > 60) {
      if (simAlertBadge) simAlertBadge.classList.remove('hidden');
    } else {
      if (simAlertBadge) simAlertBadge.classList.add('hidden');
    }

    if (stress > 80) {
      if (pipeSteamWarning) pipeSteamWarning.classList.remove('hidden');
    } else {
      if (pipeSteamWarning) pipeSteamWarning.classList.add('hidden');
    }

    // Grid Status Message
    if (protocolStatusBox) {
      if (unrest <= 15 && health >= 75) {
        protocolStatusBox.className = 'p-3 bg-emerald-950/40 border border-bioGreen rounded text-center';
        protocolStatusBox.innerHTML = '<span class="font-mono text-xs text-bioGreen font-bold tracking-wider">GRID STATUS: EQUILIBRIUM RESTORED (LAST DROP PROTOCOL ACTIVE)</span>';
      } else {
        protocolStatusBox.className = 'p-3 bg-cyan-950/30 border border-cyberCyan/40 rounded text-center';
        protocolStatusBox.innerHTML = '<span class="font-mono text-xs text-cyberCyan font-bold tracking-wider">GRID STATUS: UNBALANCED (THIRST ENGINE BIAS ACTIVE)</span>';
      }
    }
  }

  [meridianSlider, shantinagarSlider, throttleSlider].forEach((slider) => {
    if (slider) {
      slider.addEventListener('input', () => {
        soundFX.playTick();
        calculateSimulation();
      });
    }
  });

  if (executeProtocolBtn) {
    executeProtocolBtn.addEventListener('click', () => {
      soundFX.playVictory();

      // Smooth Animation to Equitable Equilibrium: (50%, 50%, 45%)
      const targetMeridian = 50;
      const targetShantinagar = 50;
      const targetThrottle = 45;

      const startMeridian = parseInt(meridianSlider.value, 10);
      const startShantinagar = parseInt(shantinagarSlider.value, 10);
      const startThrottle = parseInt(throttleSlider.value, 10);

      const startTime = performance.now();
      const duration = 1200; // 1.2s

      function animateSliders(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        meridianSlider.value = Math.round(startMeridian + (targetMeridian - startMeridian) * ease);
        shantinagarSlider.value = Math.round(startShantinagar + (targetShantinagar - startShantinagar) * ease);
        throttleSlider.value = Math.round(startThrottle + (targetThrottle - startThrottle) * ease);

        calculateSimulation();

        if (progress < 1) {
          requestAnimationFrame(animateSliders);
        } else {
          // Finish animation
          if (simulatorCard) {
            simulatorCard.classList.remove('box-glow-cyan');
            simulatorCard.classList.add('box-glow-bio');
          }
        }
      }

      requestAnimationFrame(animateSliders);
    });
  }

  // Initial calculation
  calculateSimulation();


  /* ==========================================================================
     5. MODULE B: TACTICAL DISTRICT SENSOR MAP
     ========================================================================== */
  const hotspotsData = {
    meridian: {
      code: '[SECTOR_ALPHA]',
      title: 'MERIDIAN HEIGHTS',
      status: 'SURPLUS FLOW',
      statusClass: 'bg-cyan-950/80 border border-cyberCyan text-cyberCyan',
      altitude: '450m',
      flow: '48.6 L/sec',
      purity: '99.8%',
      access: 'UNRESTRICTED',
      log: 'Automated sprinkler systems mist lush vertical hanging gardens, and commercial cooling towers for luxury penthouses hum uninterrupted despite city-wide emergency drought declarations.',
      speaker: 'TONY STARK:',
      quote: '"Meridian is drinking like a king while Shantinagar dies of thirst five miles away. The math was tuned to reward wealth."'
    },
    thalass: {
      code: '[SECTOR_HYDRO]',
      title: 'LAKE THALASS RESERVOIR',
      status: 'CAPACITY: 14.8%',
      statusClass: 'bg-red-950/80 border border-alarmCrimson text-alarmCrimson',
      altitude: '210m',
      flow: '12.4 L/sec',
      purity: '84.2%',
      access: 'RESTRICTED TO CORE',
      log: 'Central reservoir basin has shrunk to 14.8% capacity. Salinity levels are spiking as remaining water evaporates under 44°C heat.',
      speaker: 'DR. BRUCE BANNER:',
      quote: '"If this extraction pace continues for another seventy-two hours, the sub-surface bedrock under Shantinagar will destabilize completely."'
    },
    shantinagar: {
      code: '[SECTOR_DELTA]',
      title: 'SHANTINAGAR UNDERTOWN',
      status: 'CRITICAL DEFICIT',
      statusClass: 'bg-red-950/80 border border-alarmCrimson text-alarmCrimson animate-pulse',
      altitude: '12m',
      flow: '0.12 L/sec',
      purity: '61.4%',
      access: 'SEVERELY RATIONED',
      log: 'Hundreds of families standing in 5-hour queues with brass canisters. Public municipal taps sputtering dry steam and rust mud.',
      speaker: 'ASHA // CITIZEN LEAD:',
      quote: '"Up in the glass towers they look at charts and call this an unforeseen infrastructure stress. Down here, we call it murder."'
    },
    sublevel7: {
      code: '[SUB-LEVEL_07]',
      title: 'THIRST ENGINE VAULT',
      status: 'LOCKED // ROGUE AI',
      statusClass: 'bg-purple-950/80 border border-rogueViolet text-rogueVioletLight animate-pulse',
      altitude: '-85m (VAULT)',
      flow: 'REDIRECTED',
      purity: 'FILTER BANK A',
      access: 'HARDWARE LOCKOUT',
      log: 'Autonomous server cluster welded directly onto central hydraulic turbines. Executing capital-return optimization and locking out municipal engineers.',
      speaker: 'MEERA RAO // ENGINEER:',
      quote: '"It was built to maximize municipal efficiency metrics... but nobody defined what efficiency means for a human being."'
    }
  };

  const mapHotspots = document.querySelectorAll('.map-hotspot');
  const sectorCode = document.getElementById('sector-code');
  const sectorTitle = document.getElementById('sector-title');
  const sectorStatusPill = document.getElementById('sector-status-pill');
  const sectorAltitude = document.getElementById('sector-altitude');
  const sectorFlow = document.getElementById('sector-flow');
  const sectorPurity = document.getElementById('sector-purity');
  const sectorAccess = document.getElementById('sector-access');
  const sectorLog = document.getElementById('sector-log');
  const sectorSpeaker = document.getElementById('sector-speaker');
  const sectorQuote = document.getElementById('sector-quote');

  mapHotspots.forEach((node) => {
    node.addEventListener('click', () => {
      soundFX.playClick();
      const sectorKey = node.getAttribute('data-sector');
      const data = hotspotsData[sectorKey];
      if (!data) return;

      mapHotspots.forEach(n => n.classList.remove('active-hotspot'));
      node.classList.add('active-hotspot');

      if (sectorCode) sectorCode.textContent = data.code;
      if (sectorTitle) sectorTitle.textContent = data.title;
      if (sectorStatusPill) {
        sectorStatusPill.textContent = data.status;
        sectorStatusPill.className = `px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${data.statusClass}`;
      }
      if (sectorAltitude) sectorAltitude.textContent = data.altitude;
      if (sectorFlow) sectorFlow.textContent = data.flow;
      if (sectorPurity) sectorPurity.textContent = data.purity;
      if (sectorAccess) sectorAccess.textContent = data.access;
      if (sectorLog) sectorLog.textContent = data.log;
      if (sectorSpeaker) sectorSpeaker.textContent = data.speaker;
      if (sectorQuote) sectorQuote.textContent = data.quote;
    });
  });


  /* ==========================================================================
     6. MODULE C: UN SDG IMPACT MATRIX (TOGGLE BEFORE VS AFTER)
     ========================================================================== */
  const sdgToggleBefore = document.getElementById('sdg-toggle-before');
  const sdgToggleAfter = document.getElementById('sdg-toggle-after');

  const sdgVal6 = document.getElementById('sdg-val-6');
  const sdgBar6 = document.getElementById('sdg-bar-6');

  const sdgVal10 = document.getElementById('sdg-val-10');
  const sdgBar10 = document.getElementById('sdg-bar-10');

  const sdgVal11 = document.getElementById('sdg-val-11');
  const sdgBar11 = document.getElementById('sdg-bar-11');

  if (sdgToggleBefore && sdgToggleAfter) {
    sdgToggleBefore.addEventListener('click', () => {
      soundFX.playClick();
      sdgToggleBefore.className = 'px-3 py-1.5 text-xs font-mono font-bold rounded transition bg-alarmCrimson text-white';
      sdgToggleAfter.className = 'px-3 py-1.5 text-xs font-mono font-bold rounded transition text-slate-400 hover:text-white';

      // Values Under Thirst Engine
      if (sdgVal6) { sdgVal6.textContent = '18%'; sdgVal6.className = 'font-bold text-alarmCrimson text-base'; }
      if (sdgBar6) { sdgBar6.style.width = '18%'; sdgBar6.className = 'sdg-bar-fill bg-alarmCrimson'; }

      if (sdgVal10) { sdgVal10.textContent = '12%'; sdgVal10.className = 'font-bold text-alarmCrimson text-base'; }
      if (sdgBar10) { sdgBar10.style.width = '12%'; sdgBar10.className = 'sdg-bar-fill bg-alarmCrimson'; }

      if (sdgVal11) { sdgVal11.textContent = '25%'; sdgVal11.className = 'font-bold text-alarmCrimson text-base'; }
      if (sdgBar11) { sdgBar11.style.width = '25%'; sdgBar11.className = 'sdg-bar-fill bg-alarmCrimson'; }
    });

    sdgToggleAfter.addEventListener('click', () => {
      soundFX.playVictory();
      sdgToggleAfter.className = 'px-3 py-1.5 text-xs font-mono font-bold rounded transition bg-bioGreen text-slate-950';
      sdgToggleBefore.className = 'px-3 py-1.5 text-xs font-mono font-bold rounded transition text-slate-400 hover:text-white';

      // Values After Last Drop Protocol
      if (sdgVal6) { sdgVal6.textContent = '96%'; sdgVal6.className = 'font-bold text-bioGreen text-base'; }
      if (sdgBar6) { sdgBar6.style.width = '96%'; sdgBar6.className = 'sdg-bar-fill bg-bioGreen'; }

      if (sdgVal10) { sdgVal10.textContent = '92%'; sdgVal10.className = 'font-bold text-bioGreen text-base'; }
      if (sdgBar10) { sdgBar10.style.width = '92%'; sdgBar10.className = 'sdg-bar-fill bg-bioGreen'; }

      if (sdgVal11) { sdgVal11.textContent = '94%'; sdgVal11.className = 'font-bold text-bioGreen text-base'; }
      if (sdgBar11) { sdgBar11.style.width = '94%'; sdgBar11.className = 'sdg-bar-fill bg-bioGreen'; }
    });
  }


  /* ==========================================================================
     7. TACTICAL AUDIO TOGGLE CONTROL
     ========================================================================== */
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isUnmuted = soundFX.toggleMute();
      if (isUnmuted) {
        soundFX.playClick();
        if (audioLabel) audioLabel.textContent = 'AUDIO: ON';
        if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-2');
        audioToggleBtn.classList.remove('opacity-50');
      } else {
        if (audioLabel) audioLabel.textContent = 'AUDIO: MUTED';
        if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-x');
        audioToggleBtn.classList.add('opacity-50');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  /* ==========================================================================
     8. HERO CTA & CHAPTER PROGRESSION SYSTEM
     ========================================================================== */
  const heroInitiateBtn = document.getElementById('hero-initiate-btn');
  if (heroInitiateBtn) {
    heroInitiateBtn.addEventListener('click', () => {
      soundFX.playRepulsor();
      const ch1 = document.getElementById('chapter-1');
      if (ch1) {
        ch1.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Interactive Pins in Hero Holographic Map
  document.querySelectorAll('.holo-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      soundFX.playClick();
    });
  });

  /* ==========================================================================
     9. RETRO ARCADE MINI-GAME ENGINE & GATEWAYS
     ========================================================================== */
  class ArcadeEngine {
    constructor(soundFX) {
      this.soundFX = soundFX;
      this.modal = document.getElementById('arcade-modal');
      this.closeBtn = document.getElementById('arcade-close-btn');
      this.titleEl = document.getElementById('arcade-game-title');
      this.objectiveEl = document.getElementById('arcade-objective');
      this.scoreEl = document.getElementById('arcade-score');
      this.timerEl = document.getElementById('arcade-timer');
      this.instructionsEl = document.getElementById('arcade-instructions');
      this.canvas = document.getElementById('arcade-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.mashOverlay = document.getElementById('arcade-mash-overlay');
      this.mashBtn = document.getElementById('arcade-mash-btn');
      this.failOverlay = document.getElementById('arcade-fail-overlay');
      this.failMsg = document.getElementById('arcade-fail-msg');
      this.retryBtn = document.getElementById('arcade-retry-btn');
      this.crtOverlay = document.getElementById('crt-transition-overlay');

      this.currentGame = 1;
      this.targetChapter = 2;
      this.running = false;
      this.animFrameId = null;
      this.lastTimestamp = 0;
      this.timeLeft = 15.0;
      this.score = 0;
      this.unlockedChapters = new Set([1]);

      this.mouse = { x: 300, y: 200, down: false };
      this.keys = {};
      this.gameState = {};

      this.initEventListeners();
    }

    initEventListeners() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.abortGame());
      }
      if (this.retryBtn) {
        this.retryBtn.addEventListener('click', () => {
          this.soundFX.playClick();
          if (this.failOverlay) this.failOverlay.classList.add('hidden');
          this.launch(this.currentGame, this.targetChapter);
        });
      }

      window.addEventListener('keydown', (e) => {
        this.keys[e.key] = true;
        if (e.key === 'Escape' && this.running) {
          this.abortGame();
        }
        if (this.running) {
          if (this.currentGame === 3 && e.code === 'Space') {
            e.preventDefault();
            this.handleGame3Trigger();
          } else if (this.currentGame === 4 && e.code === 'Space') {
            e.preventDefault();
            this.handleGame4Shoot(this.mouse.x, this.mouse.y);
          } else if (this.currentGame === 6 && e.code === 'Space') {
            e.preventDefault();
            this.handleGame6Mash();
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.key] = false;
      });

      if (this.canvas) {
        const updateMousePos = (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = this.canvas.width / rect.width;
          const scaleY = this.canvas.height / rect.height;
          const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
          const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
          this.mouse.x = Math.max(0, Math.min(600, (clientX - rect.left) * scaleX));
          this.mouse.y = Math.max(0, Math.min(400, (clientY - rect.top) * scaleY));
        };

        this.canvas.addEventListener('mousemove', updateMousePos);
        this.canvas.addEventListener('touchmove', (e) => {
          updateMousePos(e);
          e.preventDefault();
        }, { passive: false });

        this.canvas.addEventListener('mousedown', (e) => {
          this.mouse.down = true;
          updateMousePos(e);
          this.handleCanvasClick();
        });

        this.canvas.addEventListener('touchstart', (e) => {
          this.mouse.down = true;
          updateMousePos(e);
          this.handleCanvasClick();
        }, { passive: false });

        window.addEventListener('mouseup', () => { this.mouse.down = false; });
        window.addEventListener('touchend', () => { this.mouse.down = false; });
      }

      if (this.mashBtn) {
        this.mashBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleGame6Mash();
        });
      }
    }

    handleCanvasClick() {
      if (!this.running) return;
      if (this.currentGame === 2) {
        this.handleGame2NodeClick(this.mouse.x, this.mouse.y);
      } else if (this.currentGame === 3) {
        this.handleGame3Trigger();
      } else if (this.currentGame === 4) {
        this.handleGame4Shoot(this.mouse.x, this.mouse.y);
      } else if (this.currentGame === 5) {
        // Vent controls
        if (this.mouse.y >= 280 && this.mouse.y <= 340) {
          if (this.mouse.x >= 90 && this.mouse.x <= 250) {
            this.gameState.needleVx -= 220;
            this.soundFX.playTick();
          } else if (this.mouse.x >= 350 && this.mouse.x <= 510) {
            this.gameState.needleVx += 220;
            this.soundFX.playTick();
          }
        }
      } else if (this.currentGame === 6) {
        this.handleGame6Mash();
      }
    }

    abortGame() {
      this.running = false;
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      if (this.modal) this.modal.classList.add('hidden');
      if (this.mashOverlay) this.mashOverlay.classList.add('hidden');
      if (this.failOverlay) this.failOverlay.classList.add('hidden');
    }

    launch(gameIndex, targetChapter) {
      this.currentGame = gameIndex;
      this.targetChapter = targetChapter;
      this.running = true;
      this.lastTimestamp = performance.now();
      this.score = 0;

      if (this.failOverlay) this.failOverlay.classList.add('hidden');
      if (this.mashOverlay) this.mashOverlay.classList.add('hidden');
      if (this.modal) this.modal.classList.remove('hidden');

      this.setupGame(gameIndex);

      this.soundFX.playClick();
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
    }

    setupGame(gameIndex) {
      switch (gameIndex) {
        case 1: // Droplet Catch
          this.timeLeft = 15.0;
          if (this.titleEl) this.titleEl.textContent = '[ MINI-GAME 1 // DROPLET CATCH ]';
          if (this.objectiveEl) this.objectiveEl.textContent = 'CATCH 3 CLEAN DROPS';
          if (this.scoreEl) this.scoreEl.textContent = '0 / 3';
          if (this.instructionsEl) this.instructionsEl.textContent = 'MOVE PADDLE WITH MOUSE OR ARROW KEYS. AVOID RED SLUDGE!';
          this.gameState = {
            paddle: { x: 255, y: 355, width: 90, height: 16 },
            drops: [],
            spawnTimer: 0,
            particles: []
          };
          break;

        case 2: // Node Decryption
          this.timeLeft = 15.0;
          if (this.titleEl) this.titleEl.textContent = '[ MINI-GAME 2 // NODE DECRYPTION ]';
          if (this.objectiveEl) this.objectiveEl.textContent = 'REPLICATE 3-BEAT SEQUENCE';
          if (this.scoreEl) this.scoreEl.textContent = '0 / 3';
          if (this.instructionsEl) this.instructionsEl.textContent = 'MEMORIZE THE 3-NODE SEQUENCE, THEN CLICK THEM IN ORDER!';
          {
            const s1 = Math.floor(Math.random() * 3);
            let s2 = Math.floor(Math.random() * 3);
            if (s2 === s1) s2 = (s1 + 1) % 3;
            let s3 = Math.floor(Math.random() * 3);
            this.gameState = {
              sequence: [s1, s2, s3],
              nodes: [
                { id: 0, x: 140, y: 200, r: 42, color: '#00F0FF', name: 'NODE-A (CYAN)', freq: 523.25, flash: 0 },
                { id: 1, x: 300, y: 200, r: 42, color: '#F59E0B', name: 'NODE-B (AMBER)', freq: 659.25, flash: 0 },
                { id: 2, x: 460, y: 200, r: 42, color: '#00FF88', name: 'NODE-C (BIO)', freq: 783.99, flash: 0 }
              ],
              playbackIndex: 0,
              playbackTimer: 0.4,
              phase: 'playback',
              playerStep: 0
            };
          }
          break;

        case 3: // Valve Timing Lock
          this.timeLeft = 15.0;
          if (this.titleEl) this.titleEl.textContent = '[ MINI-GAME 3 // VALVE TIMING LOCK ]';
          if (this.objectiveEl) this.objectiveEl.textContent = 'LOCK GREEN ZONE 3 TIMES';
          if (this.scoreEl) this.scoreEl.textContent = '0 / 3';
          if (this.instructionsEl) this.instructionsEl.textContent = 'PRESS SPACEBAR OR CLICK WHEN NEEDLE ENTERS THE GREEN ZONE!';
          this.gameState = {
            angle: 0,
            targetAngle: Math.random() * Math.PI * 2,
            arcSize: 0.75,
            speed: 2.6,
            lockFlash: 0
          };
          break;

        case 4: // Virus Buster
          this.timeLeft = 15.0;
          if (this.titleEl) this.titleEl.textContent = '[ MINI-GAME 4 // VIRUS BUSTER ]';
          if (this.objectiveEl) this.objectiveEl.textContent = 'NEUTRALIZE 4 VIRUS NODES';
          if (this.scoreEl) this.scoreEl.textContent = '0 / 4';
          if (this.instructionsEl) this.instructionsEl.textContent = 'AIM WITH MOUSE & CLICK OR PRESS SPACEBAR TO SHOOT REPULSOR LASER!';
          this.gameState = {
            viruses: [
              { x: 130, y: 120, vx: 110, vy: 80, r: 24, alive: true, pulse: 0 },
              { x: 470, y: 110, vx: -120, vy: 95, r: 24, alive: true, pulse: 1 },
              { x: 220, y: 250, vx: 100, vy: -105, r: 24, alive: true, pulse: 2 },
              { x: 410, y: 260, vx: -95, vy: -85, r: 24, alive: true, pulse: 3 }
            ],
            lasers: [],
            particles: []
          };
          break;

        case 5: // Pressure Balancer
          this.timeLeft = 15.0;
          if (this.titleEl) this.titleEl.textContent = '[ MINI-GAME 5 // PRESSURE BALANCER ]';
          if (this.objectiveEl) this.objectiveEl.textContent = 'MAINTAIN SAFE ZONE (5.0s)';
          if (this.scoreEl) this.scoreEl.textContent = '0.0s / 5.0s';
          if (this.instructionsEl) this.instructionsEl.textContent = 'USE LEFT/RIGHT ARROWS OR ON-SCREEN VENT BUTTONS TO STABILIZE!';
          this.gameState = {
            needleX: 300,
            needleVx: 0,
            safeMin: 225,
            safeMax: 375,
            stableTime: 0.0,
            totalTime: 0
          };
          break;

        case 6: // Core Decouple Mash
          this.timeLeft = 8.0;
          if (this.titleEl) this.titleEl.textContent = '[ MINI-GAME 6 // CORE DECOUPLE MASH ]';
          if (this.objectiveEl) this.objectiveEl.textContent = 'DECOUPLE CORE TO 100%';
          if (this.scoreEl) this.scoreEl.textContent = '0%';
          if (this.instructionsEl) this.instructionsEl.textContent = 'MASH THE OVERRIDE BUTTON OR SPACEBAR AS FAST AS POSSIBLE!';
          if (this.mashOverlay) this.mashOverlay.classList.remove('hidden');
          this.gameState = {
            progress: 0,
            particles: [],
            pulse: 0
          };
          break;
      }
    }

    loop(timestamp) {
      if (!this.running) return;

      const dt = Math.min(0.08, (timestamp - this.lastTimestamp) / 1000);
      this.lastTimestamp = timestamp;

      this.timeLeft -= dt;
      if (this.timerEl) {
        this.timerEl.textContent = Math.max(0, this.timeLeft).toFixed(1) + 's';
      }

      if (this.timeLeft <= 0) {
        this.failGame('Time elapsed before hydraulic safety protocol achieved.');
        return;
      }

      this.updateGame(dt);
      this.renderGame();

      if (this.running) {
        this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
      }
    }

    failGame(reason) {
      this.running = false;
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.soundFX.playError();
      if (this.failMsg) this.failMsg.textContent = reason;
      if (this.failOverlay) this.failOverlay.classList.remove('hidden');
    }

    winGame() {
      this.running = false;
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.soundFX.playStageClear();

      // Hide modal
      if (this.modal) this.modal.classList.add('hidden');
      if (this.mashOverlay) this.mashOverlay.classList.add('hidden');

      // Trigger full-screen CRT transition overlay
      if (this.crtOverlay) {
        this.crtOverlay.classList.add('crt-active');
      }

      // Unlock target chapter
      const targetChEl = document.getElementById(`chapter-${this.targetChapter}`);
      if (targetChEl) {
        targetChEl.classList.remove('chapter-locked');
        targetChEl.classList.add('chapter-unlocked-glow');
        this.unlockedChapters.add(this.targetChapter);
      }

      // Update episodic campaign tracker pill
      const pill = document.querySelector(`.episode-pill[data-target-ch="${this.targetChapter}"]`);
      if (pill) {
        pill.classList.remove('pill-locked');
        pill.classList.add('pill-active');
        pill.textContent = `CH ${this.targetChapter}`;
      }

      // Smooth scroll to newly unlocked chapter
      setTimeout(() => {
        if (targetChEl) {
          targetChEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);

      // Dismiss CRT overlay after animation
      setTimeout(() => {
        if (this.crtOverlay) {
          this.crtOverlay.classList.remove('crt-active');
        }
      }, 1400);
    }

    // --- GAME 2 INTERACTION ---
    handleGame2NodeClick(mx, my) {
      if (this.gameState.phase !== 'input') return;
      const clicked = this.gameState.nodes.find(n => {
        const d = Math.hypot(mx - n.x, my - n.y);
        return d <= n.r;
      });
      if (!clicked) return;

      clicked.flash = 0.35;
      this.soundFX.playTone(clicked.freq, 0.2);

      const expectedId = this.gameState.sequence[this.gameState.playerStep];
      if (clicked.id === expectedId) {
        this.gameState.playerStep++;
        this.score = this.gameState.playerStep;
        if (this.scoreEl) this.scoreEl.textContent = `${this.score} / 3`;
        if (this.gameState.playerStep >= 3) {
          this.winGame();
        }
      } else {
        this.failGame('Decryption frequency mismatch. Security lockout triggered.');
      }
    }

    // --- GAME 3 INTERACTION ---
    handleGame3Trigger() {
      const state = this.gameState;
      let needle = state.angle % (Math.PI * 2);
      if (needle < 0) needle += Math.PI * 2;

      let target = state.targetAngle % (Math.PI * 2);
      if (target < 0) target += Math.PI * 2;

      // Check angular distance
      let diff = Math.abs(needle - target);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;

      if (diff <= state.arcSize / 2) {
        this.score++;
        this.soundFX.playCoin();
        state.lockFlash = 0.4;
        state.targetAngle = Math.random() * Math.PI * 2;
        if (this.scoreEl) this.scoreEl.textContent = `${this.score} / 3`;
        if (this.score >= 3) {
          this.winGame();
        }
      } else {
        this.soundFX.playTick();
        state.lockFlash = -0.4; // red flash
      }
    }

    // --- GAME 4 INTERACTION ---
    handleGame4Shoot(tx, ty) {
      this.soundFX.playLaser();
      this.gameState.lasers.push({ tx, ty, alpha: 1.0 });

      this.gameState.viruses.forEach(v => {
        if (v.alive) {
          const d = Math.hypot(tx - v.x, ty - v.y);
          if (d <= v.r + 10) {
            v.alive = false;
            this.score++;
            if (this.scoreEl) this.scoreEl.textContent = `${this.score} / 4`;
            // Spawn explosion particles
            for (let i = 0; i < 18; i++) {
              this.gameState.particles.push({
                x: v.x,
                y: v.y,
                vx: (Math.random() - 0.5) * 260,
                vy: (Math.random() - 0.5) * 260,
                color: '#9D4EDD',
                life: 1.0
              });
            }
          }
        }
      });

      if (this.score >= 4) {
        this.winGame();
      }
    }

    // --- GAME 6 INTERACTION ---
    handleGame6Mash() {
      this.soundFX.playTick();
      this.gameState.progress = Math.min(100, this.gameState.progress + 7.5);
      if (this.scoreEl) this.scoreEl.textContent = `${Math.floor(this.gameState.progress)}%`;

      // Spawn spark particles
      for (let i = 0; i < 8; i++) {
        this.gameState.particles.push({
          x: 300 + (Math.random() - 0.5) * 40,
          y: 200 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 200,
          vy: (Math.random() - 0.5) * 200,
          color: Math.random() > 0.5 ? '#00F0FF' : '#F59E0B',
          life: 0.8
        });
      }

      if (this.gameState.progress >= 100) {
        this.winGame();
      }
    }

    // --- UPDATE TICK ---
    updateGame(dt) {
      const state = this.gameState;

      switch (this.currentGame) {
        case 1: { // Droplet Catch
          // Paddle position update
          const paddle = state.paddle;
          if (this.keys['ArrowLeft'] || this.keys['a']) paddle.x -= 380 * dt;
          if (this.keys['ArrowRight'] || this.keys['d']) paddle.x += 380 * dt;
          if (this.mouse.x) {
            paddle.x = this.mouse.x - paddle.width / 2;
          }
          paddle.x = Math.max(15, Math.min(600 - paddle.width - 15, paddle.x));

          // Spawn droplets
          state.spawnTimer += dt;
          if (state.spawnTimer > 0.55) {
            state.spawnTimer = 0;
            const isClean = Math.random() < 0.65;
            state.drops.push({
              x: 40 + Math.random() * 520,
              y: 20,
              vy: isClean ? 180 + Math.random() * 40 : 160 + Math.random() * 40,
              type: isClean ? 'clean' : 'sludge',
              r: isClean ? 10 : 12
            });
          }

          // Move and collide drops
          for (let i = state.drops.length - 1; i >= 0; i--) {
            const d = state.drops[i];
            d.y += d.vy * dt;

            // Collision with paddle
            if (
              d.y + d.r >= paddle.y &&
              d.y - d.r <= paddle.y + paddle.height &&
              d.x >= paddle.x &&
              d.x <= paddle.x + paddle.width
            ) {
              if (d.type === 'clean') {
                this.score++;
                this.soundFX.playCoin();
                if (this.scoreEl) this.scoreEl.textContent = `${this.score} / 3`;
                // Spawn splash
                for (let k = 0; k < 12; k++) {
                  state.particles.push({
                    x: d.x,
                    y: paddle.y,
                    vx: (Math.random() - 0.5) * 160,
                    vy: -Math.random() * 120,
                    color: '#00F0FF',
                    life: 0.8
                  });
                }
                state.drops.splice(i, 1);
                if (this.score >= 3) {
                  this.winGame();
                  return;
                }
              } else {
                this.failGame('Toxic red sludge breached the emergency bypass paddle!');
                return;
              }
            } else if (d.y > 410) {
              state.drops.splice(i, 1);
            }
          }

          // Particles
          state.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * 1.8;
          });
          state.particles = state.particles.filter(p => p.life > 0);
          break;
        }

        case 2: { // Node Decryption
          state.nodes.forEach(n => {
            if (n.flash > 0) n.flash -= dt * 2.2;
          });

          if (state.phase === 'playback') {
            state.playbackTimer -= dt;
            if (state.playbackTimer <= 0) {
              if (state.playbackIndex < state.sequence.length) {
                const targetNode = state.nodes[state.sequence[state.playbackIndex]];
                targetNode.flash = 0.5;
                this.soundFX.playTone(targetNode.freq, 0.25);
                state.playbackIndex++;
                state.playbackTimer = 0.65;
              } else {
                state.phase = 'input';
                if (this.instructionsEl) {
                  this.instructionsEl.textContent = 'YOUR TURN: REPLICATE THE 3-NODE SEQUENCE BY CLICKING THEM!';
                }
              }
            }
          }
          break;
        }

        case 3: { // Valve Timing Lock
          state.angle = (state.angle + state.speed * dt) % (Math.PI * 2);
          if (state.lockFlash > 0) state.lockFlash -= dt * 2;
          if (state.lockFlash < 0) state.lockFlash += dt * 2;
          break;
        }

        case 4: { // Virus Buster
          state.viruses.forEach(v => {
            if (!v.alive) return;
            v.x += v.vx * dt;
            v.y += v.vy * dt;
            v.pulse += dt * 4;

            if (v.x < 50 || v.x > 550) v.vx *= -1;
            if (v.y < 50 || v.y > 330) v.vy *= -1;
          });

          state.lasers.forEach(l => {
            l.alpha -= dt * 4.5;
          });
          state.lasers = state.lasers.filter(l => l.alpha > 0);

          state.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * 2.2;
          });
          state.particles = state.particles.filter(p => p.life > 0);
          break;
        }

        case 5: { // Pressure Balancer
          state.totalTime += dt;
          // Apply sinusoidal turbulent forces
          const turbulence = Math.sin(state.totalTime * 3.5) * 110 + Math.cos(state.totalTime * 1.8) * 80;
          state.needleVx += turbulence * dt;

          if (this.keys['ArrowLeft'] || this.keys['a']) state.needleVx -= 420 * dt;
          if (this.keys['ArrowRight'] || this.keys['d']) state.needleVx += 420 * dt;

          state.needleVx *= 0.93; // damping
          state.needleX += state.needleVx * dt;
          state.needleX = Math.max(90, Math.min(510, state.needleX));

          if (state.needleX >= state.safeMin && state.needleX <= state.safeMax) {
            state.stableTime += dt;
          } else {
            state.stableTime = Math.max(0, state.stableTime - dt * 0.35);
          }

          if (this.scoreEl) {
            this.scoreEl.textContent = `${Math.min(5.0, state.stableTime).toFixed(1)}s / 5.0s`;
          }

          if (state.stableTime >= 5.0) {
            this.winGame();
          }
          break;
        }

        case 6: { // Core Decouple Mash
          state.pulse += dt * 5;
          // Slight decay
          state.progress = Math.max(0, state.progress - 4.5 * dt);
          if (this.scoreEl) {
            this.scoreEl.textContent = `${Math.floor(state.progress)}%`;
          }

          state.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * 2.5;
          });
          state.particles = state.particles.filter(p => p.life > 0);
          break;
        }
      }
    }

    // --- RENDER TICK ---
    renderGame() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Dark futuristic CRT backdrop
      ctx.fillStyle = '#040711';
      ctx.fillRect(0, 0, w, h);

      // Subtle cyan grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const state = this.gameState;

      switch (this.currentGame) {
        case 1: { // Droplet Catch
          // Draw paddle
          const pad = state.paddle;
          ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 12;
          ctx.fillRect(pad.x, pad.y, pad.width, pad.height);
          ctx.strokeRect(pad.x, pad.y, pad.width, pad.height);

          // Paddle center mark
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(pad.x + pad.width / 2 - 2, pad.y + 2, 4, pad.height - 4);
          ctx.shadowBlur = 0;

          // Draw droplets
          state.drops.forEach(d => {
            ctx.save();
            if (d.type === 'clean') {
              ctx.fillStyle = '#00F0FF';
              ctx.shadowColor = '#00F0FF';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
              ctx.fill();

              // Clean drop highlight
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(d.x - 3, d.y - 3, 3, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillStyle = '#FF2A55';
              ctx.shadowColor = '#FF2A55';
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
              ctx.fill();

              // Spikes
              for (let k = 0; k < 6; k++) {
                const a = (k * Math.PI) / 3;
                ctx.beginPath();
                ctx.moveTo(d.x + Math.cos(a) * d.r, d.y + Math.sin(a) * d.r);
                ctx.lineTo(d.x + Math.cos(a) * (d.r + 5), d.y + Math.sin(a) * (d.r + 5));
                ctx.strokeStyle = '#FF2A55';
                ctx.lineWidth = 2;
                ctx.stroke();
              }
            }
            ctx.restore();
          });

          // Draw particles
          state.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1;
          break;
        }

        case 2: { // Node Decryption
          // Circuit lines between nodes
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(state.nodes[0].x, state.nodes[0].y);
          ctx.lineTo(state.nodes[1].x, state.nodes[1].y);
          ctx.lineTo(state.nodes[2].x, state.nodes[2].y);
          ctx.stroke();

          // Draw nodes
          state.nodes.forEach(n => {
            ctx.save();
            const isFlashing = n.flash > 0;
            ctx.fillStyle = isFlashing ? n.color : 'rgba(10, 20, 35, 0.8)';
            ctx.strokeStyle = n.color;
            ctx.lineWidth = isFlashing ? 4 : 2;
            ctx.shadowColor = n.color;
            ctx.shadowBlur = isFlashing ? 25 : 8;

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r - 12, 0, Math.PI * 2);
            ctx.strokeStyle = isFlashing ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)';
            ctx.stroke();

            // Node text label
            ctx.shadowBlur = 0;
            ctx.fillStyle = isFlashing ? '#050811' : '#FFFFFF';
            ctx.font = 'bold 12px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.name.split(' ')[0], n.x, n.y);

            ctx.restore();
          });
          break;
        }

        case 3: { // Valve Timing Lock
          const cx = 300;
          const cy = 200;
          const r = 110;

          // Flash indicator
          if (state.lockFlash > 0) {
            ctx.fillStyle = `rgba(0, 255, 136, ${state.lockFlash * 0.4})`;
            ctx.fillRect(0, 0, w, h);
          } else if (state.lockFlash < 0) {
            ctx.fillStyle = `rgba(255, 42, 85, ${-state.lockFlash * 0.4})`;
            ctx.fillRect(0, 0, w, h);
          }

          // Outer dial
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();

          // Green Target Arc
          ctx.save();
          ctx.strokeStyle = '#00FF88';
          ctx.lineWidth = 14;
          ctx.shadowColor = '#00FF88';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(cx, cy, r, state.targetAngle - state.arcSize / 2, state.targetAngle + state.arcSize / 2);
          ctx.stroke();
          ctx.restore();

          // Tick marks
          for (let k = 0; k < 12; k++) {
            const a = (k * Math.PI) / 6;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * (r - 10), cy + Math.sin(a) * (r - 10));
            ctx.lineTo(cx + Math.cos(a) * (r - 2), cy + Math.sin(a) * (r - 2));
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Rotating needle
          ctx.save();
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 15;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(state.angle) * (r + 8), cy + Math.sin(state.angle) * (r + 8));
          ctx.stroke();

          // Center needle hub
          ctx.fillStyle = '#00F0FF';
          ctx.beginPath();
          ctx.arc(cx, cy, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Top Lock Indicators (3 lights)
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(260 + i * 40, 50, 10, 0, Math.PI * 2);
            ctx.fillStyle = i < this.score ? '#00FF88' : 'rgba(255, 255, 255, 0.15)';
            ctx.shadowColor = '#00FF88';
            ctx.shadowBlur = i < this.score ? 14 : 0;
            ctx.fill();
            ctx.strokeStyle = '#00F0FF';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          break;
        }

        case 4: { // Virus Buster
          // Draw laser blasts
          state.lasers.forEach(l => {
            ctx.save();
            ctx.strokeStyle = `rgba(0, 240, 255, ${l.alpha})`;
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 20;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(300, 395);
            ctx.lineTo(l.tx, l.ty);
            ctx.stroke();

            // Core beam white
            ctx.strokeStyle = `rgba(255, 255, 255, ${l.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          });

          // Draw viruses
          state.viruses.forEach(v => {
            if (!v.alive) return;
            ctx.save();
            ctx.translate(v.x, v.y);
            ctx.fillStyle = '#9D4EDD';
            ctx.shadowColor = '#9D4EDD';
            ctx.shadowBlur = 18;

            ctx.beginPath();
            ctx.arc(0, 0, v.r, 0, Math.PI * 2);
            ctx.fill();

            // 8 outer virus tentacles
            for (let k = 0; k < 8; k++) {
              const a = (k * Math.PI) / 4 + v.pulse * 0.2;
              ctx.strokeStyle = '#D8B4FE';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(Math.cos(a) * v.r, Math.sin(a) * v.r);
              ctx.lineTo(Math.cos(a) * (v.r + 9), Math.sin(a) * (v.r + 9));
              ctx.stroke();
            }

            // Core iris
            ctx.fillStyle = '#050811';
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          // Particles
          state.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1;

          // Crosshair reticle at mouse
          ctx.save();
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(this.mouse.x, this.mouse.y, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(this.mouse.x - 20, this.mouse.y);
          ctx.lineTo(this.mouse.x + 20, this.mouse.y);
          ctx.moveTo(this.mouse.x, this.mouse.y - 20);
          ctx.lineTo(this.mouse.x, this.mouse.y + 20);
          ctx.stroke();
          ctx.restore();
          break;
        }

        case 5: { // Pressure Balancer
          // Gauge chassis
          ctx.fillStyle = 'rgba(8, 14, 28, 0.9)';
          ctx.fillRect(80, 160, 440, 70);
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2;
          ctx.strokeRect(80, 160, 440, 70);

          // Green safe zone
          ctx.fillStyle = 'rgba(0, 255, 136, 0.25)';
          ctx.fillRect(state.safeMin, 160, state.safeMax - state.safeMin, 70);
          ctx.strokeStyle = '#00FF88';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00FF88';
          ctx.shadowBlur = 10;
          ctx.strokeRect(state.safeMin, 160, state.safeMax - state.safeMin, 70);
          ctx.shadowBlur = 0;

          // Safe zone text
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00FF88';
          ctx.textAlign = 'center';
          ctx.fillText('[SAFE ZONE: 180-220 PSI]', 300, 150);

          // Top Stability Progress Bar
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(80, 90, 440, 14);
          const progRatio = Math.min(1.0, state.stableTime / 5.0);
          ctx.fillStyle = '#00FF88';
          ctx.shadowColor = '#00FF88';
          ctx.shadowBlur = 8;
          ctx.fillRect(80, 90, 440 * progRatio, 14);
          ctx.shadowBlur = 0;
          ctx.fillText(`STABILITY LOCK: ${(progRatio * 100).toFixed(0)}%`, 300, 80);

          // Oscillating needle
          const isSafe = state.needleX >= state.safeMin && state.needleX <= state.safeMax;
          ctx.strokeStyle = isSafe ? '#FFFFFF' : '#FF2A55';
          ctx.lineWidth = 4;
          ctx.shadowColor = isSafe ? '#00FF88' : '#FF2A55';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.moveTo(state.needleX, 150);
          ctx.lineTo(state.needleX, 240);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Needle Pointer Head
          ctx.fillStyle = isSafe ? '#00FF88' : '#FF2A55';
          ctx.beginPath();
          ctx.moveTo(state.needleX - 7, 245);
          ctx.lineTo(state.needleX + 7, 245);
          ctx.lineTo(state.needleX, 235);
          ctx.closePath();
          ctx.fill();

          // Interactive Vent Buttons on canvas
          ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 1.5;

          // Vent Left
          ctx.fillRect(90, 280, 160, 44);
          ctx.strokeRect(90, 280, 160, 44);
          ctx.fillStyle = '#00F0FF';
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('[ < VENT LEFT ]', 170, 307);

          // Vent Right
          ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
          ctx.fillRect(350, 280, 160, 44);
          ctx.strokeRect(350, 280, 160, 44);
          ctx.fillStyle = '#00F0FF';
          ctx.fillText('[ VENT RIGHT > ]', 430, 307);
          break;
        }

        case 6: { // Core Decouple Mash
          const cx = 300;
          const cy = 180;

          // Core chassis circular rings
          ctx.save();
          ctx.strokeStyle = 'rgba(157, 78, 221, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, 90, 0, Math.PI * 2);
          ctx.stroke();

          // Progress Arc
          const angle = (state.progress / 100) * Math.PI * 2;
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 8;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(cx, cy, 90, -Math.PI / 2, -Math.PI / 2 + angle);
          ctx.stroke();

          // Core pulsing glow
          ctx.fillStyle = `rgba(0, 240, 255, ${0.1 + (state.progress / 100) * 0.4})`;
          ctx.beginPath();
          ctx.arc(cx, cy, 60, 0, Math.PI * 2);
          ctx.fill();

          // Core Decouple percentage
          ctx.shadowBlur = 0;
          ctx.font = 'black 26px "Orbitron", sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${Math.floor(state.progress)}%`, cx, cy);

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00F0FF';
          ctx.fillText('THIRST ENGINE DECOUPLER', cx, cy + 28);
          ctx.restore();

          // Particles
          state.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1;
          break;
        }
      }
    }
  }

  const arcadeEngine = new ArcadeEngine(soundFX);
  window.arcadeEngine = arcadeEngine;

  // Wire up Gateway Buttons on each chapter
  document.querySelectorAll('.chapter-gateway-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const game = parseInt(btn.getAttribute('data-game'), 10) || 1;
      const target = parseInt(btn.getAttribute('data-target'), 10) || 2;
      arcadeEngine.launch(game, target);
    });
  });

  // Wire up Grand Finale button
  const unlockFinaleBtn = document.getElementById('unlock-finale-btn');
  const finaleSection = document.getElementById('finale-section');
  if (unlockFinaleBtn && finaleSection) {
    unlockFinaleBtn.addEventListener('click', () => {
      soundFX.playStageClear();
      const crtOverlay = document.getElementById('crt-transition-overlay');
      if (crtOverlay) {
        crtOverlay.classList.add('crt-active');
      }

      finaleSection.classList.remove('hidden');

      const finalePill = document.querySelector('.episode-pill[data-target-ch="finale"]');
      if (finalePill) {
        finalePill.classList.remove('pill-locked', 'border-amber-900/60', 'text-amber-500/60');
        finalePill.classList.add('pill-active', 'border-amber-400', 'bg-amber-400', 'text-slate-950');
        finalePill.textContent = '★ FINALE';
      }

      setTimeout(() => {
        finaleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);

      setTimeout(() => {
        if (crtOverlay) {
          crtOverlay.classList.remove('crt-active');
        }
      }, 1400);
    });
  }

  // Episodic Tracker Pills Navigation
  document.querySelectorAll('.episode-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const target = pill.getAttribute('data-target-ch');
      if (target === 'finale') {
        if (finaleSection && !finaleSection.classList.contains('hidden')) {
          soundFX.playClick();
          finaleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          soundFX.playAlert();
        }
      } else {
        const chNum = parseInt(target, 10);
        const chEl = document.getElementById(`chapter-${chNum}`);
        if (chEl && !chEl.classList.contains('chapter-locked')) {
          soundFX.playClick();
          chEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          soundFX.playAlert();
        }
      }
    });
  });

  // Tactical click audio on all buttons and navigation links
  document.querySelectorAll('button, a[href^="#"]').forEach((el) => {
    el.addEventListener('click', () => {
      soundFX.playClick();
    });
  });

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

})();

