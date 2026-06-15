/**
 * AI Chat Widget — Standalone Floating Button
 * Lightweight script that injects a floating AI chat button into the portfolio.
 * Opens the Next.js chat app in a modal iframe or new tab.
 *
 * The button is styled as a neural network node with animated connection
 * lines that visually integrate with the portfolio's neural-bg SVG.
 *
 * Usage: Add <script src="ai-chat-widget.js"></script> before </body>
 */

(function () {
  'use strict';

  // Configuration
  const CHAT_URL = '/chat'; // Change to production URL after deployment

  // Create floating button
  const btn = document.createElement('button');
  btn.id = 'ai-chat-trigger';
  btn.setAttribute('aria-label', 'Open AI Assistant');
  btn.innerHTML = `
    <!-- Neural network node icon with connection stubs -->
    <svg class="ai-node-icon" width="30" height="30" viewBox="0 0 60 60" fill="none">
      <!-- Radiating connection lines -->
      <line class="ai-conn c1" x1="30" y1="30" x2="6"  y2="8"  />
      <line class="ai-conn c2" x1="30" y1="30" x2="54" y2="8"  />
      <line class="ai-conn c3" x1="30" y1="30" x2="4"  y2="38" />
      <line class="ai-conn c4" x1="30" y1="30" x2="56" y2="38" />
      <line class="ai-conn c5" x1="30" y1="30" x2="14" y2="56" />
      <line class="ai-conn c6" x1="30" y1="30" x2="46" y2="56" />

      <!-- Tiny endpoint dots (satellite nodes) -->
      <circle class="ai-dot d1" cx="6"  cy="8"  r="3" />
      <circle class="ai-dot d2" cx="54" cy="8"  r="3" />
      <circle class="ai-dot d3" cx="4"  cy="38" r="2.5" />
      <circle class="ai-dot d4" cx="56" cy="38" r="2.5" />
      <circle class="ai-dot d5" cx="14" cy="56" r="2" />
      <circle class="ai-dot d6" cx="46" cy="56" r="2" />

      <!-- Central brain node -->
      <circle cx="30" cy="30" r="13" fill="url(#nodeGrad)" />
      <circle cx="30" cy="30" r="13" stroke="#00F5D4" stroke-width="1.5" fill="none" opacity="0.6"/>

      <!-- Inner AI symbol — stylised brain / circuit -->
      <path d="M24 30c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" stroke="#050810" stroke-width="1.4" fill="none"/>
      <path d="M27 26.5c-1.5 1-2 3-1 4.5M33 26.5c1.5 1 2 3 1 4.5" stroke="#050810" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="28" cy="30" r="1" fill="#050810"/>
      <circle cx="32" cy="30" r="1" fill="#050810"/>

      <defs>
        <radialGradient id="nodeGrad" cx="40%" cy="35%">
          <stop offset="0%"   stop-color="#00F5D4"/>
          <stop offset="100%" stop-color="#7B2FBE"/>
        </radialGradient>
      </defs>
    </svg>
    <span class="ai-btn-label">
      <div class="ai-chat-animation-container">
        <canvas class="ai-chat-canvas" width="240" height="120"></canvas>
        <div class="ai-chat-animation-text">
          <span class="ai-eq-text">Human Knowledge</span>
          <span class="ai-eq-op">+</span>
          <span class="ai-eq-text">Artificial Intelligence</span>
          <span class="ai-eq-op">=</span>
          <span class="ai-eq-innov">Innovation</span>
        </div>
      </div>
      <span class="ai-label-greeting">Hey! I'm <strong>Ezhil's AI Assistant</strong></span>
      <span class="ai-label-cta">Click to chat →</span>
      <span class="ai-label-tail"></span>
    </span>
  `;

  // Create pulse ring
  const pulse = document.createElement('span');
  pulse.className = 'ai-btn-pulse';
  btn.appendChild(pulse);

  // Create extended neural connection lines that reach into the page
  const neuralLinks = document.createElement('div');
  neuralLinks.className = 'ai-neural-links';
  neuralLinks.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <path class="ai-link l1" d="M100,100 Q60,40 10,5" />
      <path class="ai-link l2" d="M100,100 Q130,50 190,10" />
      <path class="ai-link l3" d="M100,100 Q50,80 0,60" />
      <path class="ai-link l4" d="M100,100 Q140,80 200,55" />
      <path class="ai-link l5" d="M100,100 Q70,120 5,150" />
      <path class="ai-link l6" d="M100,100 Q150,130 195,170" />
    </svg>
  `;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    /* ===== Floating Button — Bottom Left ===== */
    #ai-chat-trigger {
      position: fixed;
      bottom: 32px;
      left: 32px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(10, 15, 26, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(0, 245, 212, 0.25);
      color: #00F5D4;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 8000;
      box-shadow:
        0 0 20px rgba(0, 245, 212, 0.15),
        0 0 40px rgba(0, 245, 212, 0.05),
        inset 0 0 12px rgba(0, 245, 212, 0.05);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'DM Mono', monospace;
      overflow: visible;
    }

    #ai-chat-trigger:hover {
      transform: scale(1.12);
      border-color: rgba(0, 245, 212, 0.5);
      box-shadow:
        0 0 30px rgba(0, 245, 212, 0.3),
        0 0 60px rgba(0, 245, 212, 0.12),
        0 0 90px rgba(123, 47, 190, 0.08),
        inset 0 0 15px rgba(0, 245, 212, 0.08);
    }

    #ai-chat-trigger:active {
      transform: scale(0.95);
    }

    /* ===== Neural Node Icon ===== */
    .ai-node-icon {
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 0 6px rgba(0, 245, 212, 0.4));
    }

    /* Connection lines from center to satellite nodes */
    .ai-conn {
      stroke: #00F5D4;
      stroke-width: 1;
      opacity: 0.35;
      stroke-dasharray: 3 3;
      animation: connPulse 3s ease-in-out infinite;
    }
    .ai-conn.c1 { animation-delay: 0s; }
    .ai-conn.c2 { animation-delay: 0.5s; }
    .ai-conn.c3 { animation-delay: 1s; }
    .ai-conn.c4 { animation-delay: 1.5s; }
    .ai-conn.c5 { animation-delay: 2s; }
    .ai-conn.c6 { animation-delay: 2.5s; }

    @keyframes connPulse {
      0%, 100% { opacity: 0.2; stroke-width: 0.8; }
      50%      { opacity: 0.6; stroke-width: 1.4; }
    }

    /* Satellite endpoint dots */
    .ai-dot {
      fill: #00F5D4;
      opacity: 0.4;
      animation: dotGlow 3s ease-in-out infinite;
    }
    .ai-dot.d1 { animation-delay: 0.2s; }
    .ai-dot.d2 { animation-delay: 0.7s; }
    .ai-dot.d3 { animation-delay: 1.2s; }
    .ai-dot.d4 { animation-delay: 1.7s; }
    .ai-dot.d5 { animation-delay: 2.2s; }
    .ai-dot.d6 { animation-delay: 2.7s; }

    @keyframes dotGlow {
      0%, 100% { opacity: 0.25; r: 2; }
      50%      { opacity: 0.8;  r: 3.5; }
    }

    /* ===== Extended Neural Links — reach into page background ===== */
    .ai-neural-links {
      position: fixed;
      bottom: -4px;
      left: -4px;
      width: 200px;
      height: 200px;
      pointer-events: none;
      z-index: 7999;
      opacity: 0;
      transition: opacity 0.6s ease;
    }

    #ai-chat-trigger:hover ~ .ai-neural-links,
    .ai-neural-links.show {
      opacity: 1;
    }

    .ai-link {
      stroke: url(#linkGrad);
      stroke-width: 0.8;
      fill: none;
      opacity: 0;
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
    }

    #ai-chat-trigger:hover ~ .ai-neural-links .ai-link {
      animation: drawLink 1.5s ease forwards;
    }
    .ai-link.l1 { animation-delay: 0s; }
    .ai-link.l2 { animation-delay: 0.1s; }
    .ai-link.l3 { animation-delay: 0.2s; }
    .ai-link.l4 { animation-delay: 0.3s; }
    .ai-link.l5 { animation-delay: 0.15s; }
    .ai-link.l6 { animation-delay: 0.25s; }

    @keyframes drawLink {
      0%   { stroke-dashoffset: 200; opacity: 0; }
      30%  { opacity: 0.5; }
      100% { stroke-dashoffset: 0; opacity: 0.3; }
    }

    /* ===== Particle Canvas Animation Container ===== */
    .ai-chat-animation-container {
      position: absolute;
      bottom: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%);
      width: 240px;
      height: 145px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: none;
      z-index: 8010;
    }

    .ai-chat-canvas {
      width: 240px;
      height: 120px;
      display: block;
    }

    .ai-chat-animation-text {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 4.5px;
      opacity: 1;
      transform: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'DM Mono', monospace;
      font-size: 8.5px;
      letter-spacing: -0.015em;
      color: #a0aec0;
      white-space: nowrap;
      margin-top: 8px;
      background: rgba(10, 15, 26, 0.75);
      border: 1px solid rgba(0, 245, 212, 0.2);
      border-radius: 12px;
      padding: 4px 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05);
      cursor: pointer;
      pointer-events: auto;
    }

    .ai-chat-animation-text:hover {
      transform: translateY(-2px) scale(1.04);
      border-color: rgba(0, 245, 212, 0.55);
      box-shadow: 0 6px 16px rgba(0, 245, 212, 0.2), 0 0 10px rgba(155, 93, 229, 0.1);
      color: #ffffff;
    }

    .ai-eq-text {
      color: #a0aec0;
      transition: color 0.3s ease;
    }

    .ai-chat-animation-text:hover .ai-eq-text {
      color: #e2e8f0;
    }

    .ai-eq-op {
      color: #00F5D4;
      font-weight: 700;
      font-size: 9.5px;
      text-shadow: 0 0 4px rgba(0, 245, 212, 0.4);
    }

    .ai-eq-op:last-of-type {
      color: #9B5DE5;
      text-shadow: 0 0 4px rgba(155, 93, 229, 0.4);
    }

    .ai-eq-innov {
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: linear-gradient(90deg, #00F5D4 0%, #9B5DE5 50%, #00F5D4 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fillColor: transparent;
      animation: shine 3s linear infinite;
      filter: drop-shadow(0 0 4px rgba(0, 245, 212, 0.35));
    }

    @keyframes shine {
      to { background-position: 200% center; }
    }

    /* ===== Intro Label — always visible speech bubble on the right ===== */
    .ai-btn-label {
      position: absolute;
      left: calc(100% + 14px);
      top: 50%;
      transform: translateY(-50%);
      background: rgba(10, 15, 26, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: #c0c8d8;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.78rem;
      line-height: 1.5;
      white-space: nowrap;
      pointer-events: none;
      border: 1px solid rgba(0, 245, 212, 0.15);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 245, 212, 0.05);
      font-family: 'Inter', 'DM Mono', sans-serif;
      display: flex;
      flex-direction: column;
      gap: 2px;
      animation: labelFadeIn 0.8s ease 1.5s both;
    }

    @keyframes labelFadeIn {
      from { opacity: 0; transform: translateY(-50%) translateX(8px); }
      to   { opacity: 1; transform: translateY(-50%) translateX(0); }
    }

    /* Speech bubble tail pointing left toward the button */
    .ai-label-tail {
      position: absolute;
      left: -7px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-right: 7px solid rgba(10, 15, 26, 0.92);
      filter: drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.3));
    }

    .ai-label-greeting {
      color: #e8ecf4;
      font-weight: 400;
    }

    .ai-label-greeting strong {
      color: #00F5D4;
      font-weight: 600;
    }

    .ai-label-cta {
      color: #8892a8;
      font-size: 0.68rem;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.02em;
    }

    #ai-chat-trigger:hover .ai-btn-label {
      border-color: rgba(0, 245, 212, 0.35);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 245, 212, 0.1);
    }

    #ai-chat-trigger:hover .ai-label-cta {
      color: #00F5D4;
    }

    /* ===== Pulse Ring ===== */
    .ai-btn-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(0, 245, 212, 0.3);
      animation: aiPulse 2.5s ease-out infinite;
    }

    @keyframes aiPulse {
      0%   { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    /* ===== Chat iframe modal ===== */
    #ai-chat-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9500;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    #ai-chat-modal.open {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #ai-chat-modal.visible {
      opacity: 1;
    }

    #ai-chat-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(5, 8, 16, 0.8);
      backdrop-filter: blur(8px);
    }

    #ai-chat-frame-container {
      position: relative;
      width: min(95vw, 480px);
      height: min(90vh, 720px);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0, 245, 212, 0.15);
      box-shadow: 0 0 60px rgba(0, 245, 212, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5);
      transform: translateY(20px) scale(0.95);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #ai-chat-modal.visible #ai-chat-frame-container {
      transform: translateY(0) scale(1);
    }

    #ai-chat-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: #050810;
    }

    /* Close button on the container */
    #ai-chat-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(10, 15, 26, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 245, 212, 0.25);
      color: #8892a8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9600;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    #ai-chat-close:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.45);
      color: #ef4444;
      transform: scale(1.08) rotate(90deg);
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
    }

    #ai-chat-close:active {
      transform: scale(0.92) rotate(90deg);
    }

    @media (max-width: 640px) {
      #ai-chat-trigger {
        bottom: 20px;
        left: 20px;
        width: 56px;
        height: 56px;
      }
      .ai-neural-links {
        display: none;
      }
      #ai-chat-frame-container {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
      }
      #ai-chat-close {
        top: 12px;
        right: 12px;
      }
    }

    /* ===== Scroll Collapse Overrides ===== */
    #ai-chat-trigger.not-home .ai-btn-label {
      display: none !important;
    }
  `;

  // Add gradient def for neural links SVG
  const linksSvg = neuralLinks.querySelector('svg');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="linkGrad" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%"   stop-color="#00F5D4" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7B2FBE" stop-opacity="0.1"/>
    </linearGradient>
  `;
  linksSvg.prepend(defs);

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'ai-chat-modal';
  modal.innerHTML = `
    <div id="ai-chat-backdrop"></div>
    <div id="ai-chat-frame-container">
      <button id="ai-chat-close" aria-label="Close Chat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <iframe id="ai-chat-frame" src="" loading="lazy" title="AI Chat Assistant"></iframe>
    </div>
  `;

  // Event handlers
  let isOpen = false;

  // Animation Closure Variables
  let animFrameId = null;
  let canvas = null;
  let textEl = null;

  function initNeuralAnimation(canvasElement, textContainerElement) {
    canvas = canvasElement;
    textEl = textContainerElement;
    startAnimation();
  }

  function startAnimation() {
    if (!canvas || !textEl) return;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
    }

    const ctx = canvas.getContext('2d');
    const width = 240;
    const height = 120;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    const NUM_PARTICLES = 160;
    const particles = [];

    // 1. Silhouette points
    const silhouettePoints = [];
    // Head circle (40 points)
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      silhouettePoints.push({
        x: centerX + Math.cos(angle) * 11,
        y: centerY - 24 + Math.sin(angle) * 11,
      });
    }
    // Neck (10 points)
    for (let i = 0; i < 10; i++) {
      silhouettePoints.push({
        x: centerX - 3.5 + Math.random() * 7,
        y: centerY - 13 + Math.random() * 4,
      });
    }
    // Shoulders & Chest (110 points)
    for (let i = 0; i < 110; i++) {
      const t = Math.random();
      const xOffset = (t * 2 - 1) * 28;
      const yOffset = Math.random() * 30 - 6;
      const maxW = 28 * (1 - (yOffset - 10) * (yOffset - 10) / 900);
      const x = centerX + (Math.random() * 2 - 1) * Math.max(3, maxW);
      const y = centerY - 9 + yOffset;
      silhouettePoints.push({ x, y });
    }

    // 2. Creation of Adam Hands points
    const handsPoints = [];
    const midTouchX = centerX;
    const midTouchY = centerY - 3;

    // Left hand (Human) - Arm
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = 8 + ratio * (midTouchX - 35);
      const y = centerY + 18 - ratio * 15 + (Math.random() * 3 - 1.5);
      handsPoints.push({ x, y });
    }
    // Left pointing finger
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = (midTouchX - 35) + ratio * 30;
      const y = (centerY + 3) - ratio * 6 + (Math.random() * 2 - 1);
      handsPoints.push({ x, y });
    }

    // Right hand (Robotic) - Arm
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = width - 8 - ratio * (width - 8 - (midTouchX + 35));
      const y = centerY + 18 - ratio * 15 + (Math.random() * 1.5 - 0.75);
      handsPoints.push({ x, y });
    }
    // Right pointing finger
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = (midTouchX + 35) - ratio * 30;
      const y = (centerY + 3) - ratio * 6 + (Math.random() * 1.5 - 0.75);
      handsPoints.push({ x, y });
    }

    // 3. Sphere points (160 points)
    const spherePoints = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const theta = Math.acos(1 - 2 * (i / NUM_PARTICLES));
      const phi = Math.sqrt(NUM_PARTICLES * Math.PI) * theta;
      const x3d = Math.cos(phi) * Math.sin(theta);
      const y3d = Math.sin(phi) * Math.sin(theta);
      const z3d = Math.cos(theta);
      spherePoints.push({ x3d, y3d, z3d });
    }

    // Initialize particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.0 + 0.6,
        colorIndex: Math.random() > 0.5 ? 0 : 1,
      });
    }

    const startTime = Date.now();

    function render() {
      if (isOpen) {
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const elapsed = (Date.now() - startTime) / 1000;
      const time = elapsed % 10;

      // Text overlay is permanently displayed via CSS

      let scene = 1;
      let p = 0;

      if (time < 2) {
        scene = 1;
        p = 0;
      } else if (time >= 2 && time < 4) {
        scene = 2;
        p = (time - 2) / 2;
      } else if (time >= 4 && time < 6) {
        scene = 3;
        p = (time - 4) / 2;
      } else if (time >= 6 && time < 7.5) {
        scene = 4;
        p = 1;
      } else if (time >= 7.5 && time < 8.5) {
        scene = 5;
        p = (time - 7.5) / 1.0;
      } else {
        scene = 6;
        p = 1;
      }

      const colors = ['#00F5D4', '#9B5DE5'];

      // Morphing updates
      particles.forEach((part, i) => {
        let tx = part.x;
        let ty = part.y;

        if (scene === 1) {
          const target = silhouettePoints[i] || { x: centerX, y: centerY };
          const noiseX = Math.sin(elapsed * 2 + i) * 4;
          const noiseY = Math.cos(elapsed * 1.5 + i) * 4;
          tx = target.x + noiseX;
          ty = target.y + noiseY;
          part.x += (tx - part.x) * 0.1;
          part.y += (ty - part.y) * 0.1;
        } else if (scene === 2) {
          const target = silhouettePoints[i] || { x: centerX, y: centerY };
          const noiseX = Math.sin(elapsed * 2 + i) * (4 * (1 - p));
          const noiseY = Math.cos(elapsed * 1.5 + i) * (4 * (1 - p));
          tx = target.x + noiseX;
          ty = target.y + noiseY;
          part.x += (tx - part.x) * 0.1;
          part.y += (ty - part.y) * 0.1;
        } else if (scene === 3) {
          const sPt = silhouettePoints[i] || { x: centerX, y: centerY };
          const hPt = handsPoints[i] || { x: centerX, y: centerY };
          tx = sPt.x + (hPt.x - sPt.x) * p;
          ty = sPt.y + (hPt.y - sPt.y) * p;
          part.x += (tx - part.x) * 0.15;
          part.y += (ty - part.y) * 0.15;
        } else if (scene === 4) {
          const hPt = handsPoints[i] || { x: centerX, y: centerY };
          part.x += (hPt.x - part.x) * 0.2;
          part.y += (hPt.y - part.y) * 0.2;
        } else if (scene === 5) {
          const hPt = handsPoints[i] || { x: centerX, y: centerY };
          const sp = spherePoints[i];
          const rotSpeed = elapsed * 0.8;
          const cosR = Math.cos(rotSpeed);
          const sinR = Math.sin(rotSpeed);
          const rx = sp.x3d * cosR - sp.z3d * sinR;
          const ry = sp.y3d;
          const sphereX = centerX + rx * 26;
          const sphereY = centerY + ry * 26;
          tx = hPt.x + (sphereX - hPt.x) * p;
          ty = hPt.y + (sphereY - hPt.y) * p;
          part.x += (tx - part.x) * 0.12;
          part.y += (ty - part.y) * 0.12;
        } else {
          const sp = spherePoints[i];
          const rotSpeed = elapsed * 0.8;
          const cosR = Math.cos(rotSpeed);
          const sinR = Math.sin(rotSpeed);
          const rx = sp.x3d * cosR - sp.z3d * sinR;
          const ry = sp.y3d;
          const pulse = 1 + Math.sin(elapsed * 3.5) * 0.08;
          tx = centerX + rx * 26 * pulse;
          ty = centerY + ry * 26 * pulse;
          part.x += (tx - part.x) * 0.25;
          part.y += (ty - part.y) * 0.25;
        }
      });

      // Connections
      if (scene >= 2) {
        ctx.lineWidth = 0.4;
        const maxDist = scene >= 5 ? 18 : 15;
        for (let i = 0; i < NUM_PARTICLES; i++) {
          for (let j = i + 1; j < NUM_PARTICLES; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.18;
              ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Touch Neural Pulse & Sparks
      if (scene === 4) {
        const pulseTime = time - 6.0;
        if (pulseTime < 0.8) {
          const maxRadius = 55;
          const radius = pulseTime * (maxRadius / 0.8);
          const alpha = 1.0 - (pulseTime / 0.8);

          ctx.strokeStyle = `rgba(0, 245, 212, ${alpha * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(midTouchX, midTouchY, radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(155, 93, 229, ${alpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(midTouchX, midTouchY, radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00F5D4';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(midTouchX, midTouchY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#00F5D4';
        for (let k = 0; k < 10; k++) {
          const angle = (k / 10) * Math.PI * 2 + pulseTime * 5;
          const dist = pulseTime * 45;
          const sx = midTouchX + Math.cos(angle) * dist;
          const sy = midTouchY + Math.sin(angle) * dist;
          const sAlpha = Math.max(0, 1.0 - pulseTime * 1.5);
          ctx.fillStyle = `rgba(0, 245, 212, ${sAlpha})`;
          ctx.fillRect(sx - 0.75, sy - 0.75, 1.5, 1.5);
        }
      }

      // Render Particles
      particles.forEach((part, i) => {
        ctx.fillStyle = colors[part.colorIndex];
        const isFingertip = (i === 79 || i === 119);
        if (isFingertip && scene >= 3 && scene <= 4) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = colors[part.colorIndex];
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size + 1.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animFrameId = requestAnimationFrame(render);
    }

    render();
  }

  function openChat() {
    const iframe = document.getElementById('ai-chat-frame');
    // Verify resolved URL, if not matching CHAT_URL exactly, assign it.
    // Removes trailing slashes if any for normalization.
    const currentSrc = iframe.src || '';
    const normalizedChatUrl = CHAT_URL.replace(/\/$/, '');
    const normalizedCurrentSrc = currentSrc.replace(/\/$/, '');
    
    if (normalizedCurrentSrc !== normalizedChatUrl) {
      iframe.src = CHAT_URL;
    }
    
    modal.classList.add('open');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('visible');
      });
    });
    btn.style.display = 'none';
    neuralLinks.style.display = 'none';
    isOpen = true;
  }

  function closeChat() {
    modal.classList.remove('visible');
    setTimeout(() => {
      modal.classList.remove('open');
      btn.style.display = 'flex';
      neuralLinks.style.display = 'block';
      startAnimation();
    }, 300);
    isOpen = false;
  }

  btn.addEventListener('click', openChat);

  // Close button click listener
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'ai-chat-close' || e.target.closest('#ai-chat-close')) {
      closeChat();
    }
  });

  // Show neural links on hover (sibling selector fallback for JS)
  btn.addEventListener('mouseenter', () => {
    neuralLinks.classList.add('show');
  });
  btn.addEventListener('mouseleave', () => {
    neuralLinks.classList.remove('show');
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (isOpen && e.target.id === 'ai-chat-backdrop') {
      closeChat();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') {
      closeChat();
    }
  });

  // Inject into DOM
  document.head.appendChild(style);
  document.body.appendChild(btn);
  document.body.appendChild(neuralLinks);
  document.body.appendChild(modal);

  // Initialize Canvas Particle Animation above the speech bubble
  const animCanvas = btn.querySelector('.ai-chat-canvas');
  const animText = btn.querySelector('.ai-chat-animation-text');
  if (animCanvas && animText) {
    initNeuralAnimation(animCanvas, animText);
  }

  // Scroll logic to hide canvas animation and greeting bubble on other pages
  function handleWidgetScroll() {
    const isHome = window.scrollY < 100;
    if (isHome) {
      btn.classList.remove('not-home');
      if (!animFrameId && !isOpen) {
        startAnimation();
      }
    } else {
      btn.classList.add('not-home');
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  }

  window.addEventListener('scroll', handleWidgetScroll);
  // Run once after initial load delay to let entrance animations play
  setTimeout(handleWidgetScroll, 100);
})();
