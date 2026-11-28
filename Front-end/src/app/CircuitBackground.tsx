"use client";

import { useEffect, useRef } from "react";

type DigitDot = {
  x: number;
  y: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
  digit: string;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const surface: HTMLCanvasElement = canvas;
    const drawing: CanvasRenderingContext2D = context;
    let width = 0;
    let height = 0;
    let dots: DigitDot[] = [];
    let lastFrameTime = performance.now();
    const startTime = lastFrameTime;
    let animationFrame = 0;

    function build() {
      dots = [];

      for (let i = 0; i < 180; i++) {
        dots.push({
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          phase: randomBetween(0, Math.PI * 2),
          speed: randomBetween(0.3, 1),
          vx: randomBetween(-6, 6),
          vy: randomBetween(-6, 6),
          digit: String(Math.floor(Math.random() * 10)),
        });
      }

    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      surface.width = width * pixelRatio;
      surface.height = height * pixelRatio;
      drawing.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      build();
    }

    function drawBackground(glow: number) {
      const centerX = width / 2;
      const centerY = height / 2;
      const background = drawing.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.7,
      );
      background.addColorStop(0, "#041a22");
      background.addColorStop(1, "#02090e");
      drawing.fillStyle = background;
      drawing.fillRect(0, 0, width, height);

      const centerGlow = drawing.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.35,
      );
      centerGlow.addColorStop(0, `rgba(60, 230, 230, ${0.03 * glow})`);
      centerGlow.addColorStop(1, "rgba(60, 230, 230, 0)");
      drawing.fillStyle = centerGlow;
      drawing.fillRect(0, 0, width, height);
    }

    function drawDots(time: number, deltaTime: number) {
      const fontSize = Math.max(12, Math.min(width, height) / 35);
      drawing.font = `${fontSize}px "Courier New", monospace`;
      drawing.textAlign = "center";
      drawing.textBaseline = "middle";

      for (const dot of dots) {
        dot.x += dot.vx * deltaTime;
        dot.y += dot.vy * deltaTime;
        if (dot.x < 0) dot.x += width;
        if (dot.x > width) dot.x -= width;
        if (dot.y < 0) dot.y += height;
        if (dot.y > height) dot.y -= height;

        const alpha = 0.5 + 0.5 * Math.sin(time * dot.speed * 2 + dot.phase);
        drawing.shadowColor = "rgba(120, 255, 255, 1)";
        drawing.shadowBlur = 8;
        drawing.fillStyle = `rgba(170, 255, 255, ${0.25 + 0.6 * alpha})`;
        if (Math.random() < 0.01) {
          dot.digit = String(Math.floor(Math.random() * 10));
        }
        drawing.fillText(dot.digit, dot.x, dot.y);
      }

      drawing.shadowBlur = 0;
    }

    function frame(now: number) {
      const time = (now - startTime) / 1000;
      const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      const glow = 0.6 + 0.4 * Math.sin(time * 2);

      drawBackground(glow);
      drawDots(time, deltaTime);

      animationFrame = window.requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
