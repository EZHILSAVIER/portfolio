/* ============================================================
   EZHIL SAVIER — PORTFOLIO JS
   Animations, Particles, Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== CUSTOM CURSOR ====================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Grow cursor on interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-tag, .skill-island, .contact-item, .cta-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '14px';
        cursorDot.style.height = '14px';
        cursorRing.style.width = '50px';
        cursorRing.style.height = '50px';
        cursorRing.style.borderColor = 'rgba(0, 245, 212, 0.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '8px';
        cursorDot.style.height = '8px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'rgba(0, 245, 212, 0.25)';
      });
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // ==================== SCROLL PROGRESS ====================
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.height = scrollPercent + '%';
  });

  // ==================== HERO PARTICLES (tsParticles) ====================
  if (typeof tsParticles !== 'undefined') {
    tsParticles.load('heroParticles', {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      fpsLimit: 60,
      particles: {
        number: { value: 120, density: { enable: true, area: 900 } },
        color: { value: ['#00F5D4', '#7B2FBE', '#F5A623'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: { enable: true, speed: 0.8, minimumValue: 0.05 }
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 2, minimumValue: 0.5 }
        },
        links: {
          enable: true,
          distance: 130,
          color: '#00F5D4',
          opacity: 0.1,
          width: 0.8
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: 'none',
          outModes: { default: 'bounce' }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          resize: true
        },
        modes: {
          grab: { distance: 180, links: { opacity: 0.3, color: '#00F5D4' } }
        }
      },
      detectRetina: true,
      responsive: [
        {
          maxWidth: 768,
          options: {
            particles: {
              number: { value: 40, density: { enable: true, area: 800 } },
              links: { enable: false }
            }
          }
        }
      ]
    });
  }

  // ==================== TYPEWRITER EFFECT ====================
  const roles = ['AI Engineer', 'ML Builder', 'Data Thinker', 'Problem Solver', 'NLP Enthusiast'];
  const typewriterEl = document.getElementById('typewriterText');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeWriter() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else {
        typeSpeed = 80 + Math.random() * 60;
      }
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
      } else {
        typeSpeed = 40;
      }
    }

    setTimeout(typeWriter, typeSpeed);
  }

  typeWriter();

  // ==================== HERO TERMINAL ANIMATION ====================
  const termLines = [
    { el: 'termLine1', text: '<span class="cmd">$</span> loading portfolio modules...', delay: 800 },
    { el: 'termLine2', text: '<span class="cmd">$</span> compiling <span class="path">skills.ai</span> <span class="path">projects.ml</span>', delay: 1600 },
    { el: 'termLine3', text: '<span class="cmd">$</span> neural network: <span style="color:#28c940">connected</span>', delay: 2400 },
    { el: 'termLine4', text: '> status: <span style="color:#00F5D4;font-weight:500;">READY</span> █', delay: 3200 }
  ];

  termLines.forEach(line => {
    setTimeout(() => {
      const el = document.getElementById(line.el);
      if (el) el.innerHTML = line.text;
    }, line.delay);
  });

  // ==================== MATRIX RAIN (PhishGuard card) ====================
  const matrixCanvas = document.getElementById('matrixCanvas');
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = 400;
    matrixCanvas.height = 500;

    const chars = '01アカサタナハマヤラワ∑∆πΩ{}[]<>/*#@!';
    const fontSize = 11;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    let isMatrixVisible = false;
    let matrixAnimationId = null;

    function drawMatrix() {
      if (!isMatrixVisible) return;
      ctx.fillStyle = 'rgba(5, 8, 16, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#00F5D4';
      ctx.font = fontSize + 'px DM Mono, monospace';
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
      matrixAnimationId = requestAnimationFrame(drawMatrix);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isMatrixVisible = entry.isIntersecting;
        if (isMatrixVisible) {
          cancelAnimationFrame(matrixAnimationId);
          drawMatrix();
        } else {
          cancelAnimationFrame(matrixAnimationId);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(matrixCanvas);
  }

  // ==================== COMPLIANCE SCAN (TrustCart card) ====================
  const complianceCanvas = document.getElementById('complianceCanvas');
  if (complianceCanvas) {
    const cctx2 = complianceCanvas.getContext('2d');
    complianceCanvas.width = 400;
    complianceCanvas.height = 600;

    const legalCodes = [
      'IPC §18', 'CP-2020', 'MRP✓', 'TM§29', 'CPE§4',
      'RISK', '80%↑', 'FLAG', 'NULL', 'SCAN',
      '⚠', '✗', '✓', '⚑', '▲'
    ];
    const cFontSize = 12;
    const cColumns = Math.floor(complianceCanvas.width / (cFontSize * 3.2));
    const cDrops = new Array(cColumns).fill(1);

    let isComplianceVisible = false;
    let complianceAnimationId = null;

    function drawCompliance() {
      if (!isComplianceVisible) return;
      cctx2.fillStyle = 'rgba(5, 8, 16, 0.07)';
      cctx2.fillRect(0, 0, complianceCanvas.width, complianceCanvas.height);

      cctx2.font = cFontSize + 'px "DM Mono", monospace';

      for (let i = 0; i < cDrops.length; i++) {
        const code = legalCodes[Math.floor(Math.random() * legalCodes.length)];
        // Alternate between danger red and dim amber
        const isWarning = Math.random() > 0.7;
        cctx2.fillStyle = isWarning ? 'rgba(229, 62, 62, 0.55)' : 'rgba(245, 166, 35, 0.35)';
        cctx2.globalAlpha = 0.5 + Math.random() * 0.3;
        cctx2.fillText(code, i * (cFontSize * 3.2), cDrops[i] * cFontSize * 1.6);

        if (cDrops[i] * cFontSize * 1.6 > complianceCanvas.height && Math.random() > 0.97) {
          cDrops[i] = 0;
        }
        cDrops[i]++;
      }
      cctx2.globalAlpha = 1;
      complianceAnimationId = requestAnimationFrame(drawCompliance);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isComplianceVisible = entry.isIntersecting;
        if (isComplianceVisible) {
          cancelAnimationFrame(complianceAnimationId);
          drawCompliance();
        } else {
          cancelAnimationFrame(complianceAnimationId);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(complianceCanvas);
  }

  // ==================== RADAR CHART (About section) ====================
  const radarCanvas = document.getElementById('radarChart');
  if (radarCanvas) {
    const rctx = radarCanvas.getContext('2d');
    const centerX = 140, centerY = 140;
    const maxRadius = 100;
    const labels = ['ML', 'NLP', 'CV', 'Lead', 'Comm'];
    const values = [0.9, 0.85, 0.8, 0.88, 0.85];
    const numAxes = labels.length;
    const angleStep = (Math.PI * 2) / numAxes;
    const startAngle = -Math.PI / 2;

    let animProgress = 0;

    function drawRadar() {
      rctx.clearRect(0, 0, 400, 400);

      // Draw grid
      for (let ring = 1; ring <= 5; ring++) {
        const r = (ring / 5) * maxRadius;
        rctx.beginPath();
        for (let i = 0; i <= numAxes; i++) {
          const angle = startAngle + i * angleStep;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          if (i === 0) rctx.moveTo(x, y);
          else rctx.lineTo(x, y);
        }
        rctx.closePath();
        rctx.strokeStyle = 'rgba(0, 245, 212, 0.08)';
        rctx.lineWidth = 1;
        rctx.stroke();
      }

      // Draw axes
      for (let i = 0; i < numAxes; i++) {
        const angle = startAngle + i * angleStep;
        rctx.beginPath();
        rctx.moveTo(centerX, centerY);
        rctx.lineTo(
          centerX + maxRadius * Math.cos(angle),
          centerY + maxRadius * Math.sin(angle)
        );
        rctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
        rctx.lineWidth = 1;
        rctx.stroke();
      }

      // Draw data polygon
      const progress = Math.min(animProgress, 1);
      rctx.beginPath();
      for (let i = 0; i <= numAxes; i++) {
        const idx = i % numAxes;
        const angle = startAngle + idx * angleStep;
        const r = values[idx] * maxRadius * progress;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) rctx.moveTo(x, y);
        else rctx.lineTo(x, y);
      }
      rctx.closePath();
      rctx.fillStyle = 'rgba(0, 245, 212, 0.12)';
      rctx.fill();
      rctx.strokeStyle = '#00F5D4';
      rctx.lineWidth = 2;
      rctx.stroke();

      // Draw data points and labels
      for (let i = 0; i < numAxes; i++) {
        const angle = startAngle + i * angleStep;
        const r = values[i] * maxRadius * progress;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        // Point
        rctx.beginPath();
        rctx.arc(x, y, 4, 0, Math.PI * 2);
        rctx.fillStyle = '#00F5D4';
        rctx.fill();
        rctx.beginPath();
        rctx.arc(x, y, 7, 0, Math.PI * 2);
        rctx.strokeStyle = 'rgba(0, 245, 212, 0.3)';
        rctx.lineWidth = 1;
        rctx.stroke();

        // Label
        const labelR = maxRadius + 28;
        const lx = centerX + labelR * Math.cos(angle);
        const ly = centerY + labelR * Math.sin(angle);
        rctx.font = '9px "Space Mono", monospace';
        rctx.fillStyle = '#8892a8';
        rctx.textAlign = 'center';
        rctx.textBaseline = 'middle';
        rctx.fillText(labels[i].toUpperCase(), lx, ly);
      }

      if (animProgress < 1) {
        animProgress += 0.02;
        requestAnimationFrame(drawRadar);
      }
    }

    // Trigger radar animation on scroll
    const radarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animProgress = 0;
          drawRadar();
          radarObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    radarObserver.observe(radarCanvas);
  }

  // ==================== CONSTELLATION CANVAS (Education) ====================
  const constCanvas = document.getElementById('constellationCanvas');
  if (constCanvas) {
    const cctx = constCanvas.getContext('2d');

    function resizeConst() {
      const section = constCanvas.parentElement.parentElement;
      constCanvas.width = section.offsetWidth;
      constCanvas.height = section.offsetHeight;
    }
    resizeConst();
    window.addEventListener('resize', resizeConst);

    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.0003 + 0.0001,
        alpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    let isConstVisible = false;
    let constAnimationId = null;

    function drawConstellation() {
      if (!isConstVisible) return;
      cctx.clearRect(0, 0, constCanvas.width, constCanvas.height);
      const time = Date.now() * 0.001;

      stars.forEach((s, i) => {
        const px = s.x * constCanvas.width;
        const py = s.y * constCanvas.height;
        const alpha = s.alpha * (0.5 + 0.5 * Math.sin(time * 2 + s.phase));

        cctx.beginPath();
        cctx.arc(px, py, s.r, 0, Math.PI * 2);
        cctx.fillStyle = `rgba(0, 245, 212, ${alpha})`;
        cctx.fill();

        // Connect nearby stars
        for (let j = i + 1; j < stars.length; j++) {
          const dx = (stars[j].x - s.x) * constCanvas.width;
          const dy = (stars[j].y - s.y) * constCanvas.height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            cctx.beginPath();
            cctx.moveTo(px, py);
            cctx.lineTo(stars[j].x * constCanvas.width, stars[j].y * constCanvas.height);
            cctx.strokeStyle = `rgba(0, 245, 212, ${0.05 * (1 - dist / 120)})`;
            cctx.lineWidth = 0.5;
            cctx.stroke();
          }
        }

        // Slow drift
        s.x += Math.sin(time + s.phase) * s.speed;
        s.y += Math.cos(time + s.phase * 0.7) * s.speed * 0.5;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;
      });

      constAnimationId = requestAnimationFrame(drawConstellation);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isConstVisible = entry.isIntersecting;
        if (isConstVisible) {
          cancelAnimationFrame(constAnimationId);
          drawConstellation();
        } else {
          cancelAnimationFrame(constAnimationId);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(constCanvas);
  }

  // ==================== GSAP SCROLL ANIMATIONS ====================
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-content', {
    opacity: 0,
    y: 60,
    duration: 1.2,
    delay: 0.5,
    ease: 'power3.out'
  });

  gsap.from('.hero-terminal', {
    opacity: 0,
    x: 60,
    duration: 1,
    delay: 1,
    ease: 'power3.out'
  });

  // Section labels and titles
  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.from(label, {
      scrollTrigger: { trigger: label, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // About section
  gsap.from('.about-visual', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.2,
    ease: 'power2.out'
  });

  // ==================== PARALLAX SCROLL — PROJECT CARDS ====================
  const projectCards = gsap.utils.toArray('.project-card');
  const mm = gsap.matchMedia();

  // Desktop (min-width: 769px)
  mm.add("(min-width: 769px)", () => {
    // Entrance: cards enter from alternating offsets (parallel stagger)
    projectCards.forEach((card, i) => {
      const isEven = i % 2 === 0;
      const fromX  = isEven ? -40 : 40;
      const fromY  = isEven ? 80  : 100;
      const fromRotate = isEven ? -3 : 3;

      gsap.set(card, { transformOrigin: 'center center' });

      gsap.fromTo(card,
        {
          opacity: 0,
          y: fromY,
          x: fromX,
          rotation: fromRotate,
          scale: 0.92,
          filter: 'blur(6px)'
        },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'top 52%',
            scrub: 1.5
          },
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'power3.out'
        }
      );

      // Continuous scroll-depth parallax: each card moves at a different speed
      const depthFactor = isEven ? -20 : -35;
      gsap.to(card, {
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        yPercent: depthFactor,
        ease: 'none'
      });

      // Background layer moves counter to card — creates 3D depth pop
      const bg = card.querySelector('.card-bg');
      if (bg) {
        gsap.to(bg, {
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          yPercent: depthFactor * -1.8,
          ease: 'none'
        });
      }

      // Card icon floats independently (slowest layer)
      const icon = card.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: isEven ? -20 : 20,
          ease: 'none'
        });
      }
    });

    // Section title slow parallax drift (slowest of all)
    gsap.to('.projects .section-title', {
      scrollTrigger: {
        trigger: '.projects',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: -55,
      ease: 'none'
    });

    // Ambient floating glow sweeps across the section on scroll
    const projectsSection = document.querySelector('.projects');
    if (projectsSection) {
      let glow = projectsSection.querySelector('.projects-parallax-glow');
      if (!glow) {
        glow = document.createElement('div');
        glow.className = 'projects-parallax-glow';
        projectsSection.appendChild(glow);
      }

      gsap.fromTo(glow,
        { x: '-15%', y: '30%', opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.projects',
            start: 'top 65%',
            end: 'bottom 20%',
            scrub: 2
          },
          x: '115%',
          y: '-15%',
          opacity: 0.55,
          ease: 'none'
        }
      );
    }
  });

  // Mobile (max-width: 768px)
  mm.add("(max-width: 768px)", () => {
    projectCards.forEach((card) => {
      // Clean, simple once-off entry animation without filters or scrubs
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 40
        },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    });
  });

  // Skill islands — staggered fade up + glow
  gsap.utils.toArray('.skill-island').forEach((island, i) => {
    gsap.from(island, {
      scrollTrigger: { trigger: island, start: 'top 85%' },
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power2.out'
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: { trigger: item, start: 'top 80%' },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // Education cards
  gsap.from('.edu-card.main', {
    scrollTrigger: { trigger: '.edu-cards', start: 'top 80%' },
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.utils.toArray('.edu-card.mini').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      opacity: 0,
      y: 30,
      duration: 0.7,
      delay: 0.2 + i * 0.15,
      ease: 'power2.out'
    });
  });

  // Contact section
  gsap.from('.contact-headline', {
    scrollTrigger: { trigger: '.contact-headline', start: 'top 85%' },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.utils.toArray('.contact-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%' },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // ==================== STAT COUNTER ANIMATION ====================
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const decimal = el.getAttribute('data-decimal');
        const duration = 2000;
        const startTime = Date.now();

        function updateCounter() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);

          if (decimal) {
            const finalVal = parseFloat(target + '.' + decimal);
            const current = (eased * finalVal).toFixed(2);
            el.textContent = current;
          } else {
            el.textContent = Math.floor(eased * target);
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        updateCounter();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));

  // ==================== SMOOTH SCROLL FOR NAV LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==================== MAGNETIC HOVER ON PROJECT CARDS ====================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `translateY(-8px) scale(1.02) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1) perspective(800px) rotateX(0) rotateY(0)';
    });
  });

  // ==================== TICKER DUPLICATION (infinite scroll fix) ====================
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    // Already duplicated in HTML
  }

  // ==================== GHIBLI CANVAS — INK SPLASH REVEAL ====================
  const profileFrame = document.getElementById('profileFrame');
  const ghibliCanvas = document.getElementById('ghibliCanvas');

  if (profileFrame && ghibliCanvas) {
    const CS  = 560;           // internal canvas resolution (2× display for crispness)
    const CR  = 58;            // core erase radius
    const RS  = 0.015;         // restore speed per frame (lower = slower / dreamier)
    const MAX_RF = 280;        // max restore frames before final snap (~4.6s at 60fps)

    ghibliCanvas.width  = CS;
    ghibliCanvas.height = CS;

    const ctx = ghibliCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // -- Ghibli image loader --
    const gImg = new Image();
    gImg.src = 'profile-ghibli.png';

    // Off-screen clean copy used for restore blending
    const offC = document.createElement('canvas');
    offC.width = offC.height = CS;
    const oCtx = offC.getContext('2d');

    function clipCircle(context) {
      context.beginPath();
      context.arc(CS / 2, CS / 2, CS / 2 - 1, 0, Math.PI * 2);
      context.clip();
    }

    function drawFull(context) {
      context.clearRect(0, 0, CS, CS);
      context.save();
      clipCircle(context);
      context.drawImage(gImg, 0, 0, CS, CS);
      context.restore();
    }

    gImg.onload = () => {
      drawFull(oCtx);   // bake clean copy
      drawFull(ctx);    // paint main canvas
    };

    // ── INK SPLASH ERASE ──────────────────────────────────────────────
    // Creates a core circle + organic satellite drops + tapered bridges.
    // Velocity (dx,dy) biases the spread direction & drop count.
    function inkSplash(x, y, dx, dy) {
      const speed  = Math.hypot(dx, dy);
      const travel = Math.atan2(dy, dx);     // cursor travel angle

      ctx.globalCompositeOperation = 'destination-out';

      // 1. Solid core
      const cg = ctx.createRadialGradient(x, y, 0, x, y, CR);
      cg.addColorStop(0,    'rgba(0,0,0,1)');
      cg.addColorStop(0.82, 'rgba(0,0,0,1)');
      cg.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(x, y, CR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Satellite drops — count + spread react to speed
      const dropCount  = speed < 3 ? 5 : 8;
      const spreadBias = speed < 3 ? 1.0 : 0.55; // 1=uniform, 0=forward-cone
      const maxDist    = CR * (speed < 3 ? 1.3 : 1.9);

      for (let i = 0; i < dropCount; i++) {
        // Angle: blend between uniform ring and forward direction
        const uniform  = (i / dropCount) * Math.PI * 2;
        const biased   = travel + (Math.random() - 0.5) * Math.PI * 1.2;
        const dropAngle = uniform * spreadBias + biased * (1 - spreadBias);

        const dist   = CR * 0.55 + Math.random() * maxDist;
        const radius = CR * (0.13 + Math.random() * 0.24);
        const tx = x + Math.cos(dropAngle) * dist;
        const ty = y + Math.sin(dropAngle) * dist;

        // Bridge (tapered stroke from core edge to drop)
        const bx0 = x  + Math.cos(dropAngle) * (CR * 0.75);
        const by0 = y  + Math.sin(dropAngle) * (CR * 0.75);

        ctx.save();
        ctx.lineCap  = 'round';
        ctx.lineJoin = 'round';

        // Stroke gradient: thick at core, tapering to zero at drop
        const bg = ctx.createLinearGradient(bx0, by0, tx, ty);
        bg.addColorStop(0, `rgba(0,0,0,${0.7 + Math.random() * 0.25})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.strokeStyle = bg;
        ctx.lineWidth   = radius * (1.1 + Math.random() * 0.6);

        ctx.beginPath();
        // Slight curve via quadratic bezier for organic feel
        const midX = (bx0 + tx) / 2 + (Math.random() - 0.5) * 12;
        const midY = (by0 + ty) / 2 + (Math.random() - 0.5) * 12;
        ctx.moveTo(bx0, by0);
        ctx.quadraticCurveTo(midX, midY, tx, ty);
        ctx.stroke();
        ctx.restore();

        // Satellite drop bead
        const dg = ctx.createRadialGradient(tx, ty, 0, tx, ty, radius * 1.3);
        dg.addColorStop(0,    'rgba(0,0,0,1)');
        dg.addColorStop(0.65, 'rgba(0,0,0,0.9)');
        dg.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(tx, ty, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Micro-specks (tiny texture dots at the fringe)
      for (let i = 0; i < 6; i++) {
        const a  = Math.random() * Math.PI * 2;
        const d  = CR * (1.4 + Math.random() * 0.7);
        const sr = CR * 0.04 + Math.random() * CR * 0.04;
        ctx.fillStyle = `rgba(0,0,0,${0.4 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    // ── SLOW DREAMY RESTORE ──────────────────────────────────────────
    let prevX = -1, prevY = -1;
    let restoreRaf = null;

    function cancelRestore() {
      if (restoreRaf) { cancelAnimationFrame(restoreRaf); restoreRaf = null; }
    }

    function startRestore() {
      let frames = 0;
      function step() {
        frames++;
        // Layer the clean Ghibli image on top at low alpha each frame
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = RS;
        ctx.drawImage(offC, 0, 0);
        ctx.globalAlpha = 1;

        if (frames < MAX_RF) {
          restoreRaf = requestAnimationFrame(step);
        } else {
          drawFull(ctx);   // final snap to perfect state
          profileFrame.classList.remove('erasing');
          restoreRaf = null;
        }
      }
      restoreRaf = requestAnimationFrame(step);
    }

    // ── EVENTS ───────────────────────────────────────────────────────
    function getCoords(e) {
      const rect  = profileFrame.getBoundingClientRect();
      const sx    = CS / rect.width;
      const sy    = CS / rect.height;
      let clientX, clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * sx,
        y: (clientY - rect.top) * sy
      };
    }

    function handleStart(e) {
      cancelRestore();
      prevX = prevY = -1;
    }

    function handleMove(e) {
      cancelRestore();
      profileFrame.classList.add('erasing');

      const { x, y } = getCoords(e);

      // Skip pixels outside the circular mask
      if (Math.hypot(x - CS/2, y - CS/2) > CS/2 - 6) return;

      const dx = prevX < 0 ? 0 : x - prevX;
      const dy = prevY < 0 ? 0 : y - prevY;

      inkSplash(x, y, dx, dy);

      prevX = x; prevY = y;

      if (e.touches) {
        e.preventDefault(); // Prevent scrolling on touch devices while drawing
      }
    }

    function handleEnd() {
      prevX = prevY = -1;
      cancelRestore();
      startRestore();
    }

    profileFrame.addEventListener('mousemove', handleMove);
    profileFrame.addEventListener('mouseleave', handleEnd);
    profileFrame.addEventListener('mouseenter', handleStart);

    profileFrame.addEventListener('touchmove', handleMove, { passive: false });
    profileFrame.addEventListener('touchstart', handleStart, { passive: true });
    profileFrame.addEventListener('touchend', handleEnd, { passive: true });
  }

});
