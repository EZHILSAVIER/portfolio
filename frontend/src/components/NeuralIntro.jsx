"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NeuralIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(1); // 1: Single node, 2: Multi-nodes, 3: Galaxy, 4: Final reveal
  const [textIndex, setTextIndex] = useState(0);

  // Text sequences
  const texts = [
    "Every idea starts as a single connection.",
    "Every innovation starts as a single neuron.",
    "Welcome to the network."
  ];

  const finalLines = [
    "Building Intelligence.",
    "Designing Experiences.",
    "Creating the Future."
  ];

  // Handle phase and text timings
  useEffect(() => {
    // Phase 1 -> Phase 2 (Split)
    const t1 = setTimeout(() => {
      setPhase(2);
      setTextIndex(1);
    }, 2800);

    // Phase 2 -> Phase 3 (Galaxy explosion)
    const t2 = setTimeout(() => {
      setPhase(3);
      setTextIndex(2);
    }, 5600);

    // Phase 3 -> Phase 4 (Final taglines)
    const t3 = setTimeout(() => {
      setPhase(4);
      setTextIndex(3);
    }, 8500);

    // Complete intro
    const t4 = setTimeout(() => {
      onComplete();
    }, 12500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Canvas Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle classes
    class Particle {
      constructor(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.vz = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.brightness = Math.random() * 0.4 + 0.6;
      }

      update(currentPhase, time) {
        if (currentPhase === 1) {
          // Stay centered, vibrate slightly
          this.x += (Math.random() - 0.5) * 0.2;
          this.y += (Math.random() - 0.5) * 0.2;
          this.z += (Math.random() - 0.5) * 0.2;
        } else if (currentPhase === 2) {
          // Push outwards slowly from center
          this.x += this.vx * 0.8;
          this.y += this.vy * 0.8;
          this.z += this.vz * 0.8;
        } else if (currentPhase >= 3) {
          // Swirl in a spiral galaxy form around center
          const angle = 0.01 + (150 / Math.max(1, Math.sqrt(this.x * this.x + this.y * this.y))) * 0.002;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          
          const rx = this.x * cos - this.y * sin;
          const ry = this.x * sin + this.y * cos;
          
          this.x = rx + this.vx * 0.15;
          this.y = ry + this.vy * 0.15;
          this.z += this.vz * 0.5;

          // Pull back in if too far
          const dist = Math.sqrt(this.x * this.x + this.y * this.y);
          if (dist > Math.max(canvas.width, canvas.height) * 0.5) {
            this.x *= 0.95;
            this.y *= 0.95;
          }
        }
      }
    }

    // Initialize particles array
    const particles = [];
    const focalLength = 350;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Particle color palettes
    const colors = ["#00F5D4", "#7B2FBE", "#00bbf9", "#f15bb5"];

    // Initialize single neuron at center
    particles.push(new Particle(0, 0, 0, "#00F5D4"));
    particles[0].size = 5;

    // Helper to spawn more nodes
    const spawnNodes = (count, maxDist) => {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const dist = Math.random() * maxDist;
        
        const x = dist * Math.sin(phi) * Math.cos(theta);
        const y = dist * Math.sin(phi) * Math.sin(theta);
        const z = dist * Math.cos(phi);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(new Particle(x, y, z, color));
      }
    };

    let spawnedPhase2 = false;
    let spawnedPhase3 = false;
    let pulseRadius = 0;
    let globalGlow = 0;

    // Animation Loop
    let time = 0;
    const animate = () => {
      time++;
      ctx.fillStyle = "rgba(5, 8, 16, 0.25)"; // Trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Trigger spawns based on active phase
      if (phase === 2 && !spawnedPhase2) {
        spawnNodes(35, 120);
        spawnedPhase2 = true;
      }
      if (phase === 3 && !spawnedPhase3) {
        spawnNodes(180, 250);
        // Add thousands of tiny cosmic background stars
        for (let i = 0; i < 400; i++) {
          const theta = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.max(canvas.width, canvas.height) * 0.6;
          const p = new Particle(dist * Math.cos(theta), dist * Math.sin(theta), (Math.random() - 0.5) * 400, "rgba(255,255,255,0.15)");
          p.size = Math.random() * 0.8;
          p.vx *= 0.1;
          p.vy *= 0.1;
          particles.push(p);
        }
        spawnedPhase3 = true;
      }

      // Draw cosmic nebula center glow
      if (phase >= 3) {
        const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(100, 300 - globalGlow));
        grad.addColorStop(0, "rgba(123, 47, 190, 0.08)");
        grad.addColorStop(0.5, "rgba(0, 245, 212, 0.03)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 3D projection & rendering
      const projected = [];
      for (const p of particles) {
        p.update(phase, time);
        
        // 3D rotation around Y and X axis slowly
        const angleY = 0.0015;
        const angleX = 0.0008;
        
        // Rotate Y
        let cos = Math.cos(angleY);
        let sin = Math.sin(angleY);
        let x1 = p.x * cos - p.z * sin;
        let z1 = p.z * cos + p.x * sin;
        
        // Rotate X
        cos = Math.cos(angleX);
        sin = Math.sin(angleX);
        let y2 = p.y * cos - z1 * sin;
        let z2 = z1 * cos + p.y * sin;
        
        p.x = x1;
        p.y = y2;
        p.z = z2;

        const scale = focalLength / (focalLength + p.z + 300);
        const projX = canvas.width / 2 + p.x * scale;
        const projY = canvas.height / 2 + p.y * scale;

        if (projX >= 0 && projX <= canvas.width && projY >= 0 && projY <= canvas.height) {
          projected.push({
            p,
            x: projX,
            y: projY,
            scale,
            size: Math.max(0.5, p.size * scale * (phase === 1 ? 1.5 : 1))
          });
        }
      }

      // Sort by depth (painters algorithm)
      projected.sort((a, b) => b.p.z - a.p.z);

      // Draw connection lines
      if (phase >= 2) {
        ctx.beginPath();
        const maxDist = phase === 2 ? 80 : 70;
        for (let i = 0; i < projected.length; i++) {
          const nodeA = projected[i];
          if (nodeA.p.color.startsWith("rgba(255")) continue; // Skip static stars
          
          let connectionsCount = 0;
          for (let j = i + 1; j < projected.length; j++) {
            const nodeB = projected[j];
            if (nodeB.p.color.startsWith("rgba(255")) continue;
            if (connectionsCount > (phase === 2 ? 3 : 2)) break; // Cap connections for performance & style

            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < maxDist) {
              const alpha = (1 - d / maxDist) * 0.18 * nodeA.scale;
              ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
              ctx.lineWidth = 0.5 * nodeA.scale;
              ctx.moveTo(nodeA.x, nodeA.y);
              ctx.lineTo(nodeB.x, nodeB.y);
              connectionsCount++;
            }
          }
        }
        ctx.stroke();
      }

      // Draw particles
      for (const node of projected) {
        const { p, x, y, size } = node;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        if (p.size === 5 && phase === 1) {
          // Extra glow on central single neuron
          const pulseAlpha = Math.abs(Math.sin(time * 0.05)) * 0.4 + 0.1;
          const radialGlow = ctx.createRadialGradient(x, y, 0, x, y, 22 + Math.sin(time * 0.08) * 4);
          radialGlow.addColorStop(0, "rgba(0, 245, 212, 1)");
          radialGlow.addColorStop(0.2, "rgba(0, 245, 212, 0.4)");
          radialGlow.addColorStop(1, "rgba(0, 245, 212, 0)");
          ctx.fillStyle = radialGlow;
          ctx.arc(x, y, 25, 0, Math.PI * 2);
          ctx.fill();

          // Ripple waves
          pulseRadius += 0.8;
          if (pulseRadius > 50) pulseRadius = 0;
          ctx.beginPath();
          ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 245, 212, ${(1 - pulseRadius / 50) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = phase === 4 ? 6 : 0;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Phase 4: bright cosmic fade transition
      if (phase === 4) {
        globalGlow = Math.min(100, globalGlow + 1.2);
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#050810] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Cinematic Text Overlay */}
      <div className="relative z-10 text-center max-w-xl px-6 flex flex-col justify-center items-center h-full gap-8">
        <AnimatePresence mode="wait">
          {textIndex < 3 ? (
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-lg md:text-xl font-light tracking-wide text-slate-300 text-center"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 0 10px rgba(0, 245, 212, 0.15)",
                lineHeight: "1.6"
              }}
            >
              {texts[textIndex]}
            </motion.p>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.5 } }
              }}
              className="flex flex-col gap-4 items-center justify-center"
            >
              {finalLines.map((line, idx) => (
                <motion.h1
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 10, filter: "blur(6px)" },
                    visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-2xl md:text-4xl font-bold tracking-widest text-center"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "linear-gradient(135deg, #e8ecf4 30%, #00F5D4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 4px 15px rgba(0,245,212,0.1)"
                  }}
                >
                  {line}
                </motion.h1>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Intro Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={onComplete}
        className="absolute bottom-8 right-8 px-4 py-2 rounded-full border border-slate-700/50 bg-[#0a0f1a]/40 text-slate-400 text-xs tracking-widest uppercase pointer-events-auto z-[10100] transition-all cursor-pointer backdrop-blur-md"
        style={{
          fontFamily: "var(--font-mono)",
          borderColor: "rgba(0, 245, 212, 0.15)",
        }}
      >
        Skip Intro →
      </motion.button>
    </div>
  );
}
