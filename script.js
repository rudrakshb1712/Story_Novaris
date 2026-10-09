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
     3. VERTICAL ENVIRONMENT TRANSITION (GENERATIVE CANVAS SCROLL ENGINE)
     ========================================================================== */
  const bgCanvas = document.getElementById('bg-environment-canvas');
  const bgCtx = bgCanvas.getContext('2d');

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  let scrollPercent = 0;
  const hudScrollDepth = document.getElementById('hud-scroll-depth');
  const hudDistrictName = document.getElementById('hud-district-name');
  const hudGridStatus = document.getElementById('hud-grid-status');

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercent = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
    const roundedPercent = Math.round(scrollPercent * 100);

    if (hudScrollDepth) hudScrollDepth.textContent = `${roundedPercent}%`;

    // 3 Scroll Strata Telemetry
    if (scrollPercent <= 0.3) {
      if (hudDistrictName) hudDistrictName.textContent = 'MERIDIAN HEIGHTS';
      if (hudGridStatus) {
        hudGridStatus.textContent = 'SURPLUS FLOW';
        hudGridStatus.className = 'font-bold text-cyberCyan';
      }
    } else if (scrollPercent <= 0.6) {
      if (hudDistrictName) hudDistrictName.textContent = 'CONDUIT SUB-NET 12';
      if (hudGridStatus) {
        hudGridStatus.textContent = 'PRESSURE IRREGULARITY';
        hudGridStatus.className = 'font-bold text-amber-400';
      }
    } else {
      if (hudDistrictName) hudDistrictName.textContent = 'SHANTINAGAR / SUB-LEVEL 7';
      if (hudGridStatus) {
        hudGridStatus.textContent = 'CRITICAL DEFICIT (6.2%)';
        hudGridStatus.className = 'font-bold text-alarmCrimson';
      }
    }
  }, { passive: true });

  // Floating background atmospheric particles
  const bgAtmosphereParticles = Array.from({ length: 45 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    speedY: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function renderEnvironmentCanvas() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const w = bgCanvas.width;
    const h = bgCanvas.height;

    // Environmental Gradient based on Scroll Transition
    // 0-30%: Meridian Heights (Crystalline twilight blue / cyan)
    // 31-60%: Conduit Sub-Net (Industrial dark slate / amber hazard)
    // 61-100%: Shantinagar & Sub-Level 7 (Deep void / neon violet Thirst Engine)
    let topColor, bottomColor;

    if (scrollPercent <= 0.3) {
      const t = scrollPercent / 0.3;
      topColor = '#061325';
      bottomColor = '#0b203c';
    } else if (scrollPercent <= 0.6) {
      const t = (scrollPercent - 0.3) / 0.3;
      topColor = '#090d19';
      bottomColor = '#181220';
    } else {
      const t = (scrollPercent - 0.6) / 0.4;
      topColor = '#05070e';
      bottomColor = '#1a0928';
    }

    const bgGrad = bgCtx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, topColor);
    bgGrad.addColorStop(1, bottomColor);
    bgCtx.fillStyle = bgGrad;
    bgCtx.fillRect(0, 0, w, h);

    // Floating Atmospheric Motes
    for (let p of bgAtmosphereParticles) {
      p.y -= p.speedY;
      if (p.y < 0) p.y = h;

      bgCtx.save();
      bgCtx.globalAlpha = p.alpha;
      if (scrollPercent <= 0.3) {
        bgCtx.fillStyle = '#00F0FF';
      } else if (scrollPercent <= 0.6) {
        bgCtx.fillStyle = '#F59E0B';
      } else {
        bgCtx.fillStyle = '#C77DFF';
      }
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bgCtx.fill();
      bgCtx.restore();
    }

    // Dynamic Visual Features by Depth
    if (scrollPercent <= 0.3) {
      // Stage 1: Meridian Heights Skyline Silhouettes & Holographic Fountains
      bgCtx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      bgCtx.lineWidth = 1.5;
      for (let x = 40; x < w; x += 110) {
        const height = (Math.sin(x * 0.02) * 0.5 + 0.5) * 180 + 100;
        bgCtx.strokeRect(x, h - height, 60, height);
      }
    } else if (scrollPercent <= 0.6) {
      // Stage 2: Heavy Industrial Conduits & Leaking Steam Grids
      bgCtx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
      bgCtx.lineWidth = 6;
      bgCtx.beginPath();
      bgCtx.moveTo(0, h * 0.35);
      bgCtx.lineTo(w, h * 0.45);
      bgCtx.moveTo(0, h * 0.7);
      bgCtx.lineTo(w, h * 0.6);
      bgCtx.stroke();
    } else {
      // Stage 3: Sub-Level 7 Thirst Engine Pulsing 9-Line Glyphs
      const centerX = w * 0.85;
      const centerY = h * 0.5;
      const radius = 90;
      const time = Date.now() * 0.001;

      bgCtx.save();
      bgCtx.strokeStyle = 'rgba(157, 78, 221, 0.28)';
      bgCtx.lineWidth = 2;
      bgCtx.beginPath();
      bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      bgCtx.stroke();

      // 9 radial interlocking lines
      for (let i = 0; i < 9; i++) {
        const angle = (i * Math.PI * 2) / 9 + time * 0.4;
        bgCtx.beginPath();
        bgCtx.moveTo(centerX + Math.cos(angle) * (radius - 20), centerY + Math.sin(angle) * (radius - 20));
        bgCtx.lineTo(centerX + Math.cos(angle) * (radius + 15), centerY + Math.sin(angle) * (radius + 15));
        bgCtx.stroke();
      }
      bgCtx.restore();
    }

    requestAnimationFrame(renderEnvironmentCanvas);
  }
  requestAnimationFrame(renderEnvironmentCanvas);


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
