"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NeuralScene() {
  const canvasRef = useRef(null);
  // Text overlay is now permanently placed on the AI widget

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = 300;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    const NUM_PARTICLES = 160;
    const particles = [];

    // 1. Generate Human Silhouette points
    const silhouettePoints = [];
    // Head circle
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      silhouettePoints.push({
        x: centerX + Math.cos(angle) * 16,
        y: centerY - 35 + Math.sin(angle) * 16,
      });
    }
    // Neck
    for (let i = 0; i < 10; i++) {
      silhouettePoints.push({
        x: centerX - 5 + Math.random() * 10,
        y: centerY - 19 + Math.random() * 6,
      });
    }
    // Shoulders & Chest (Bust shape)
    for (let i = 0; i < 110; i++) {
      const t = Math.random();
      const xOffset = (t * 2 - 1) * 35; // shoulder width
      const yOffset = Math.random() * 45 - 10; // chest height
      
      // Keep it within shoulder shape (narrow at neck, wide at shoulders, narrow chest)
      const maxW = 35 * (1 - (yOffset - 15) * (yOffset - 15) / 1600);
      const x = centerX + (Math.random() * 2 - 1) * Math.max(5, maxW);
      const y = centerY - 13 + yOffset;
      
      silhouettePoints.push({ x, y });
    }

    // 2. Generate Creation of Adam Hands points
    const handsPoints = [];
    const midTouchX = centerX;
    const midTouchY = centerY - 5;

    // Human Hand (Left)
    // Arm segment from left edge
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = 10 + ratio * (midTouchX - 45);
      const y = centerY + 25 - ratio * 20 + (Math.random() * 4 - 2);
      handsPoints.push({ x, y });
    }
    // Hand and pointing index finger
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = (midTouchX - 45) + ratio * 40;
      const y = (centerY + 5) - ratio * 10 + (Math.random() * 3 - 1.5);
      handsPoints.push({ x, y });
    }

    // Robotic Hand (Right)
    // Segmented angular arm lines
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = width - 10 - ratio * (width - 10 - (midTouchX + 45));
      const y = centerY + 25 - ratio * 20 + (Math.random() * 2 - 1);
      handsPoints.push({ x, y });
    }
    // Robot finger pointing left to meet human finger
    for (let i = 0; i < 40; i++) {
      const ratio = i / 40;
      const x = (midTouchX + 45) - ratio * 40;
      const y = (centerY + 5) - ratio * 10 + (Math.random() * 2 - 1);
      handsPoints.push({ x, y });
    }

    // 3. Generate 3D Sphere points for Hologram Avatar
    const spherePoints = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const theta = Math.acos(1 - 2 * (i / NUM_PARTICLES));
      const phi = Math.sqrt(NUM_PARTICLES * Math.PI) * theta;
      
      const x3d = Math.cos(phi) * Math.sin(theta);
      const y3d = Math.sin(phi) * Math.sin(theta);
      const z3d = Math.cos(theta);

      spherePoints.push({ x3d, y3d, z3d });
    }

    // Initialize particles with randomized velocities
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.8,
        colorIndex: Math.random() > 0.5 ? 0 : 1, // Cyan or Purple
      });
    }

    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, width, height);

      const elapsed = (Date.now() - startTime) / 1000;
      const time = elapsed % 10; // 10-second loop

      // Text overlay is permanently displayed via CSS/JSX

      // Determine active scene state and interpolation factor
      let scene = 1;
      let p = 0; // Morph interpolation factor [0, 1]

      if (time < 2) {
        scene = 1; // Silhouette drifting
        p = 0;
      } else if (time >= 2 && time < 4) {
        scene = 2; // Silhouette connecting + lines connecting
        p = (time - 2) / 2; // morphing into position
      } else if (time >= 4 && time < 6) {
        scene = 3; // Reaching hands
        p = (time - 4) / 2; // morphing to hands
      } else if (time >= 6 && time < 7.5) {
        scene = 4; // Touch & Spark
        p = 1;
      } else if (time >= 7.5 && time < 8.5) {
        scene = 5; // Dissolve into sphere
        p = (time - 7.5) / 1.0;
      } else {
        scene = 6; // Hologram avatar loop
        p = 1;
      }

      const colors = ["#00F5D4", "#9B5DE5"]; // Cyan & Purple

      // Position update & morphing loop
      particles.forEach((part, i) => {
        let tx = part.x;
        let ty = part.y;

        if (scene === 1) {
          // Silhouette drifting
          const target = silhouettePoints[i] || { x: centerX, y: centerY };
          const noiseX = Math.sin(elapsed * 2 + i) * 6;
          const noiseY = Math.cos(elapsed * 1.5 + i) * 6;
          tx = target.x + noiseX;
          ty = target.y + noiseY;

          // Simple drift interpolation
          part.x += (tx - part.x) * 0.1;
          part.y += (ty - part.y) * 0.1;
        } else if (scene === 2) {
          // Move from drifting to exact silhouette coordinates
          const target = silhouettePoints[i] || { x: centerX, y: centerY };
          const noiseX = Math.sin(elapsed * 2 + i) * (6 * (1 - p));
          const noiseY = Math.cos(elapsed * 1.5 + i) * (6 * (1 - p));
          tx = target.x + noiseX;
          ty = target.y + noiseY;

          part.x += (tx - part.x) * 0.1;
          part.y += (ty - part.y) * 0.1;
        } else if (scene === 3) {
          // Interpolate from silhouette to hands
          const sPt = silhouettePoints[i] || { x: centerX, y: centerY };
          const hPt = handsPoints[i] || { x: centerX, y: centerY };
          tx = sPt.x + (hPt.x - sPt.x) * p;
          ty = sPt.y + (hPt.y - sPt.y) * p;

          part.x += (tx - part.x) * 0.15;
          part.y += (ty - part.y) * 0.15;
        } else if (scene === 4) {
          // Keep hands touching, fingertips at midTouch
          const hPt = handsPoints[i] || { x: centerX, y: centerY };
          part.x += (hPt.x - part.x) * 0.2;
          part.y += (hPt.y - part.y) * 0.2;
        } else if (scene === 5) {
          // Morph hands into 3D rotating Sphere
          const hPt = handsPoints[i] || { x: centerX, y: centerY };
          
          // Rotate sphere coordinates in 3D
          const sp = spherePoints[i];
          const rotSpeed = elapsed * 0.8;
          const cosR = Math.cos(rotSpeed);
          const sinR = Math.sin(rotSpeed);

          const rx = sp.x3d * cosR - sp.z3d * sinR;
          const ry = sp.y3d;
          
          // Project
          const sphereX = centerX + rx * 38;
          const sphereY = centerY + ry * 38;

          tx = hPt.x + (sphereX - hPt.x) * p;
          ty = hPt.y + (sphereY - hPt.y) * p;

          part.x += (tx - part.x) * 0.12;
          part.y += (ty - part.y) * 0.12;
        } else {
          // Rotating AI Avatar sphere loop
          const sp = spherePoints[i];
          const rotSpeed = elapsed * 0.8;
          const cosR = Math.cos(rotSpeed);
          const sinR = Math.sin(rotSpeed);

          const rx = sp.x3d * cosR - sp.z3d * sinR;
          const ry = sp.y3d;

          const pulse = 1 + Math.sin(elapsed * 3.5) * 0.08;
          tx = centerX + rx * 38 * pulse;
          ty = centerY + ry * 38 * pulse;

          part.x += (tx - part.x) * 0.25;
          part.y += (ty - part.y) * 0.25;
        }
      });

      // 4. Draw connections (Neural network lines)
      if (scene >= 2) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < NUM_PARTICLES; i++) {
          for (let j = i + 1; j < NUM_PARTICLES; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect nearby points
            const maxDist = scene >= 5 ? 26 : 22;
            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.22;
              ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // 5. Draw Touch Neural Pulse & Sparks (Scene 4)
      if (scene === 4) {
        const pulseTime = time - 6.0; // [0, 1.5]
        
        // Expanding ring pulse
        if (pulseTime < 0.8) {
          const maxRadius = 80;
          const radius = pulseTime * (maxRadius / 0.8);
          const alpha = 1.0 - (pulseTime / 0.8);
          
          ctx.strokeStyle = `rgba(0, 245, 212, ${alpha * 0.7})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(midTouchX, midTouchY, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner ring
          ctx.strokeStyle = `rgba(123, 47, 190, ${alpha * 0.5})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(midTouchX, midTouchY, radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Touch contact flash
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00F5D4";
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(midTouchX, midTouchY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Sparks flying out
        ctx.fillStyle = "#00F5D4";
        for (let k = 0; k < 12; k++) {
          const angle = (k / 12) * Math.PI * 2 + pulseTime * 5;
          const dist = pulseTime * 65;
          const sx = midTouchX + Math.cos(angle) * dist;
          const sy = midTouchY + Math.sin(angle) * dist;
          const sAlpha = Math.max(0, 1.0 - pulseTime * 1.5);
          
          ctx.fillStyle = `rgba(0, 245, 212, ${sAlpha})`;
          ctx.fillRect(sx - 1, sy - 1, 2, 2);
        }
      }

      // 6. Render Particles
      particles.forEach((part, i) => {
        ctx.fillStyle = colors[part.colorIndex];
        
        // Make fingertips glow extra bright in Scene 3 & 4
        const isFingertip = (i === 79 || i === 119);
        if (isFingertip && scene >= 3 && scene <= 4) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = colors[part.colorIndex];
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size + 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-[320px] mx-auto py-2">
      {/* Canvas viewport */}
      <div className="relative w-[300px] h-[180px]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />
      </div>

      {/* Styled looping equation overlay text */}
      <div className="h-20 w-full flex items-center justify-center mt-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-center flex flex-row items-center justify-center select-none text-[11px] font-mono tracking-wide gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/20 bg-[#0a0f1a]/70 hover:border-cyan-500/50 hover:scale-102 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,245,212,0.2)] cursor-pointer"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span style={{ color: "var(--color-text-secondary)" }}>Human Knowledge</span>
          <span className="text-cyan-400 font-bold text-[12px] text-shadow-cyan">+</span>
          <span style={{ color: "var(--color-text-secondary)" }}>Artificial Intelligence</span>
          <span className="text-purple-400 font-bold text-[12px] text-shadow-purple">=</span>
          <span
            className="font-bold tracking-wider uppercase text-[11px] animate-gradient-shine"
            style={{
              background: "linear-gradient(90deg, #00F5D4 0%, #9B5DE5 50%, #00F5D4 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 4px rgba(0,245,212,0.35))",
            }}
          >
            Innovation
          </span>
        </motion.div>
      </div>
    </div>
  );
}
