"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];

type CircuitPath = {
  points: Point[];
  lengths: number[];
  total: number;
};

type DigitStream = {
  path: CircuitPath;
  t: number;
  speed: number;
  length: number;
  spacing: number;
  chars: string[];
  changeTimer: number;
};

const DIGITS = "0123456789";
const FONT_FAMILY = '"Courier New", monospace';

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makePath(points: Point[]): CircuitPath {
  const lengths: number[] = [];
  let total = 0;

  for (let i = 1; i < points.length; i++) {
    const length = Math.hypot(
      points[i][0] - points[i - 1][0],
      points[i][1] - points[i - 1][1],
    );
    lengths.push(length);
    total += length;
  }

  return { points, lengths, total };
}

function wrap01(value: number) {
  return ((value % 1) + 1) % 1;
}

function pointAt(path: CircuitPath, fraction: number): Point {
  let distance = fraction * path.total;

  for (let i = 0; i < path.lengths.length; i++) {
    const length = path.lengths[i];
    if (distance <= length) {
      const progress = length === 0 ? 0 : distance / length;
      const start = path.points[i];
      const end = path.points[i + 1];
      return [
        start[0] + (end[0] - start[0]) * progress,
        start[1] + (end[1] - start[1]) * progress,
      ];
    }
    distance -= length;
  }

  return path.points[path.points.length - 1];
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
    let paths: CircuitPath[] = [];
    let streams: DigitStream[] = [];
    let counter = 0;
    let lastTick = 0;
    let lastFrameTime = performance.now();
    const startTime = lastFrameTime;
    let animationFrame = 0;

    function build() {
      paths = [];
      streams = [];

      const centerX = width / 2;
      const centerY = height / 2;
      const step = Math.max(26, Math.min(width, height) / 18);
      const directions: Point[] = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let i = 0; i < 80; i++) {
        let direction =
          directions[Math.floor(Math.random() * directions.length)];
        let x =
          Math.round((centerX + randomBetween(-step * 2, step * 2)) / step) *
          step;
        let y =
          Math.round((centerY + randomBetween(-step * 2, step * 2)) / step) *
          step;
        const points: Point[] = [[x, y]];
        const segmentCount = Math.floor(randomBetween(4, 12));

        for (let segment = 0; segment < segmentCount; segment++) {
          const length = step * Math.floor(randomBetween(1, 5));
          x += direction[0] * length;
          y += direction[1] * length;
          points.push([x, y]);
          direction =
            direction[0] !== 0
              ? [0, Math.random() < 0.5 ? 1 : -1]
              : [Math.random() < 0.5 ? 1 : -1, 0];
        }

        paths.push(makePath(points));
      }

      for (const path of paths) {
        if (Math.random() < 0.2) {
          streams.push({
            path,
            t: Math.random(),
            speed: randomBetween(0.015, 0.04),
            length: Math.floor(randomBetween(3, 5)),
            spacing: randomBetween(0.012, 0.02),
            chars: Array.from(
              { length: 10 },
              () => DIGITS[Math.floor(Math.random() * DIGITS.length)],
            ),
            changeTimer: 0,
          });
        }
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
      background.addColorStop(0, "#06252f");
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
      centerGlow.addColorStop(0, `rgba(60, 230, 230, ${0.18 * glow})`);
      centerGlow.addColorStop(1, "rgba(60, 230, 230, 0)");
      drawing.fillStyle = centerGlow;
      drawing.fillRect(0, 0, width, height);
    }

    function drawTraces() {
      drawing.lineWidth = 1.2;
      drawing.lineJoin = "round";
      drawing.strokeStyle = "rgba(60, 220, 230, 0.22)";

      for (const path of paths) {
        drawing.beginPath();
        drawing.moveTo(path.points[0][0], path.points[0][1]);
        for (let i = 1; i < path.points.length; i++) {
          drawing.lineTo(path.points[i][0], path.points[i][1]);
        }
        drawing.stroke();

        const endpoint = path.points[path.points.length - 1];
        drawing.fillStyle = "rgba(60, 220, 230, 0.35)";
        drawing.fillRect(endpoint[0] - 2, endpoint[1] - 2, 4, 4);
      }
    }

    function drawStreams(deltaTime: number) {
      const fontSize = Math.max(18, Math.min(width, height) / 22);
      drawing.font = `${fontSize}px ${FONT_FAMILY}`;
      drawing.textAlign = "center";
      drawing.textBaseline = "middle";

      for (const stream of streams) {
        stream.t = wrap01(stream.t + stream.speed * deltaTime);
        stream.changeTimer += deltaTime;
        if (stream.changeTimer > 0.25) {
          stream.changeTimer = 0;
          stream.chars[Math.floor(Math.random() * stream.chars.length)] =
            DIGITS[Math.floor(Math.random() * DIGITS.length)];
        }

        for (let i = 0; i < stream.length; i++) {
          const position = pointAt(
            stream.path,
            wrap01(stream.t - stream.spacing * i),
          );
          const opacity = 1 - i / stream.length;

          if (i === 0) {
            drawing.shadowColor = "rgba(120, 255, 255, 1)";
            drawing.shadowBlur = 12;
            drawing.fillStyle = "rgba(190, 255, 255, 1)";
          } else {
            drawing.shadowBlur = 0;
            drawing.fillStyle = `rgba(120, 255, 255, ${0.85 * opacity})`;
          }

          drawing.fillText(
            stream.chars[i % stream.chars.length],
            position[0],
            position[1],
          );
        }
        drawing.shadowBlur = 0;
      }
    }

    function drawChip(time: number, now: number) {
      const centerX = width / 2;
      const centerY = height / 2;
      const size = Math.min(width, height) * 0.12;
      const glow = 0.6 + 0.4 * Math.sin(time * 2);

      if (now - lastTick > 100) {
        counter = (counter + 1) % 10000;
        lastTick = now;
      }

      drawing.shadowColor = `rgba(80, 255, 240, ${glow})`;
      drawing.shadowBlur = 30;
      drawing.fillStyle = "#0b2d35";
      drawing.fillRect(
        centerX - size / 2,
        centerY - size / 2,
        size,
        size,
      );
      drawing.strokeStyle = `rgba(120, 255, 240, ${0.6 + 0.4 * glow})`;
      drawing.lineWidth = 2;
      drawing.strokeRect(
        centerX - size / 2,
        centerY - size / 2,
        size,
        size,
      );
      drawing.shadowBlur = 0;

      drawing.shadowColor = "rgba(140, 255, 255, 1)";
      drawing.shadowBlur = 16;
      drawing.fillStyle = "#c8ffff";
      drawing.font = `bold ${size * 0.28}px ${FONT_FAMILY}`;
      drawing.textAlign = "center";
      drawing.textBaseline = "middle";
      drawing.fillText(String(counter).padStart(4, "0"), centerX, centerY);
      drawing.shadowBlur = 0;
    }

    function frame(now: number) {
      const time = (now - startTime) / 1000;
      const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;

      const glow = 0.6 + 0.4 * Math.sin(time * 2);
      const zoom = 1 + 0.05 * Math.sin(time * 0.35);
      const centerX = width / 2;
      const centerY = height / 2;

      drawBackground(glow);
      drawing.save();
      drawing.translate(centerX, centerY);
      drawing.scale(zoom, zoom);
      drawing.translate(-centerX, -centerY);
      drawTraces();
      drawStreams(deltaTime);
      drawChip(time, now);
      drawing.restore();

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
