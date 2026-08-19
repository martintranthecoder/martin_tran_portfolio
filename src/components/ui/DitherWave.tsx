"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

type RGB = [number, number, number];

interface DitherWaveProps {
  /** Wave scroll speed. */
  waveSpeed?: number;
  /** Spatial frequency of the waves (higher = tighter). */
  waveFrequency?: number;
  /** Vertical displacement amplitude of the waves. */
  waveAmplitude?: number;
  /** Number of quantization steps for the dithering (lower = chunkier bands). */
  colorNum?: number;
  /** Size (in device pixels) of each dither cell. */
  pixelSize?: number;
  /** Deep-water base color for dark mode (0..1 RGB). */
  colorA?: RGB;
  /** Mid-tone teal for dark mode (0..1 RGB). */
  colorB?: RGB;
  /** Crest highlight color for dark mode (0..1 RGB). */
  colorC?: RGB;
  /** Base color for light mode (0..1 RGB). */
  lightColorA?: RGB;
  /** Mid-tone for light mode (0..1 RGB). */
  lightColorB?: RGB;
  /** Crest highlight for light mode (0..1 RGB). */
  lightColorC?: RGB;
  /** Enable subtle ripple that follows the cursor. */
  enableMouse?: boolean;
  /** Render a single static frame instead of animating. */
  disableAnimation?: boolean;
}

// Dark-ocean palette (linear-ish 0..1 RGB). Trough is a distinct blue — clearly
// lighter/bluer than the near-black page background so the waves read.
const DEFAULT_A: RGB = [0.03, 0.08, 0.18]; // deep ocean blue trough
const DEFAULT_B: RGB = [0.04, 0.28, 0.42]; // teal
const DEFAULT_C: RGB = [0.3, 0.78, 0.82]; // bright cyan crest

// Light-ocean palette — kept airy but saturated enough to be clearly visible
// against white while dark text stays readable.
const LIGHT_A: RGB = [0.74, 0.88, 0.95]; // sky
const LIGHT_B: RGB = [0.45, 0.73, 0.86]; // sea blue
const LIGHT_C: RGB = [0.2, 0.55, 0.72]; // deeper cyan crest

const VERT = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;      // in pixels, y-up
uniform float u_enableMouse;

uniform float u_waveSpeed;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform float u_colorNum;
uniform float u_pixelSize;

uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;

// --- Ashima simplex noise 2D ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian motion.
float fbm(vec2 p) {
  float total = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    total += snoise(p * freq) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return total;
}

// 4x4 ordered (Bayer) dithering threshold in [0,1).
float bayer(vec2 pixel) {
  int x = int(mod(pixel.x, 4.0));
  int y = int(mod(pixel.y, 4.0));
  int index = x + y * 4;
  float m[16] = float[16](
     0.0,  8.0,  2.0, 10.0,
    12.0,  4.0, 14.0,  6.0,
     3.0, 11.0,  1.0,  9.0,
    15.0,  7.0, 13.0,  5.0);
  return m[index] / 16.0;
}

void main() {
  // Snap to a coarse pixel grid for the chunky dither look.
  vec2 cell = floor(gl_FragCoord.xy / u_pixelSize);
  vec2 px = cell * u_pixelSize + u_pixelSize * 0.5;
  vec2 uv = px / u_resolution;

  // Aspect-correct coordinates.
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * u_waveSpeed;

  // Flowing wave field.
  vec2 q = p * u_waveFrequency;
  float wave = fbm(q + vec2(t * 0.6, t * 0.2));
  wave += 0.5 * fbm(q * 1.7 - vec2(t * 0.3, t * 0.5));

  // Mouse ripple.
  if (u_enableMouse > 0.5) {
    vec2 m = u_mouse / u_resolution;
    m.x *= u_resolution.x / u_resolution.y;
    float d = distance(p, m);
    wave += 0.35 * exp(-d * 6.0) * sin(d * 22.0 - u_time * 3.0);
  }

  // Vertical banding so waves read as an ocean horizon.
  float band = uv.y * 4.0 + wave * u_waveAmplitude * 2.5;
  float v = 0.5 + 0.5 * sin(band * 3.14159);

  // Ordered dither quantization of the intensity.
  float dith = bayer(cell);
  float levels = max(u_colorNum, 1.0);
  float quant = floor(v * levels + dith) / levels;

  // Map intensity through the dark-ocean palette.
  vec3 col = mix(u_colorA, u_colorB, smoothstep(0.0, 0.6, quant));
  col = mix(col, u_colorC, smoothstep(0.55, 1.0, quant));

  fragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("DitherWave shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function DitherWave({
  waveSpeed = 0.05,
  waveFrequency = 2.5,
  waveAmplitude = 0.6,
  colorNum = 5,
  pixelSize = 3,
  colorA = DEFAULT_A,
  colorB = DEFAULT_B,
  colorC = DEFAULT_C,
  lightColorA = LIGHT_A,
  lightColorB = LIGHT_B,
  lightColorC = LIGHT_C,
  enableMouse = true,
  disableAnimation = false,
}: DitherWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;

    const isDark = resolvedTheme === "dark";
    const paletteA = isDark ? colorA : lightColorA;
    const paletteB = isDark ? colorB : lightColorB;
    const paletteC = isDark ? colorC : lightColorC;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = !disableAnimation && !reduceMotion;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("DitherWave link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Fullscreen triangle.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      enableMouse: gl.getUniformLocation(program, "u_enableMouse"),
      waveSpeed: gl.getUniformLocation(program, "u_waveSpeed"),
      waveFrequency: gl.getUniformLocation(program, "u_waveFrequency"),
      waveAmplitude: gl.getUniformLocation(program, "u_waveAmplitude"),
      colorNum: gl.getUniformLocation(program, "u_colorNum"),
      pixelSize: gl.getUniformLocation(program, "u_pixelSize"),
      colorA: gl.getUniformLocation(program, "u_colorA"),
      colorB: gl.getUniformLocation(program, "u_colorB"),
      colorC: gl.getUniformLocation(program, "u_colorC"),
    };

    gl.uniform1f(u.waveSpeed, waveSpeed);
    gl.uniform1f(u.waveFrequency, waveFrequency);
    gl.uniform1f(u.waveAmplitude, waveAmplitude);
    gl.uniform1f(u.colorNum, colorNum);
    gl.uniform1f(u.pixelSize, pixelSize);
    gl.uniform1f(u.enableMouse, enableMouse ? 1 : 0);
    gl.uniform3fv(u.colorA, paletteA);
    gl.uniform3fv(u.colorB, paletteB);
    gl.uniform3fv(u.colorC, paletteC);

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouse.x = e.clientX * dpr;
      mouse.y = (window.innerHeight - e.clientY) * dpr; // y-up
    };
    if (enableMouse) window.addEventListener("mousemove", onMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.resolution, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let start = 0;
    let visible = true;
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && animate && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const draw = (time: number) => {
      gl.uniform1f(u.time, time);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (!start) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(frame);
    };

    if (animate) {
      raf = requestAnimationFrame(frame);
    } else {
      draw(0);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [
    mounted,
    resolvedTheme,
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    colorNum,
    pixelSize,
    enableMouse,
    disableAnimation,
    colorA,
    colorB,
    colorC,
    lightColorA,
    lightColorB,
    lightColorC,
  ]);

  if (!mounted || !resolvedTheme) return null;

  // Solid base behind the canvas so there's no flash before WebGL paints.
  const base = resolvedTheme === "dark" ? "hsl(224 71.4% 4.1%)" : "hsl(0 0% 100%)";

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ backgroundColor: base }}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
