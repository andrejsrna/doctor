'use client'

import { useEffect, useRef, type RefObject } from 'react'

/**
 * Full-bleed WebGL "signal field" behind the hero.
 *
 * - Background: the release artwork smeared through domain-warped noise, with
 *   flowing neural contour lines.
 * - Specimen: the cover is drawn inside the rect of `slotRef`, glitch-sliced on
 *   snares, punched on kicks, with a chromatic lens under the cursor.
 * - Everything is clocked by a 174 BPM two-step pattern (kick 1 & 2.5,
 *   snare 2 & 4). The envelope is mirrored into CSS vars (--kick / --snare) on
 *   `rootRef` so DOM typography pulses with the shader.
 */

const BPM = 174
const BEAT = 60 / BPM
const KICKS = [0, 2.5]
const SNARES = [1, 3]

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIntro;
uniform float uKick;
uniform float uKickAge;
uniform float uSnare;
uniform vec4 uRect;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uReady;
uniform sampler2D uCover;
uniform sampler2D uArt;

const vec3 BASE = vec3(0.043, 0.043, 0.059);
const vec3 PURPLE = vec3(0.608, 0.369, 1.0);
const vec3 GREEN = vec3(0.224, 1.0, 0.078);
const vec3 CRIMSON = vec3(1.0, 0.0, 0.302);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec3 sampleCover(vec2 uv, float split) {
  float r = texture2D(uCover, uv + vec2(split, 0.0)).r;
  float g = texture2D(uCover, uv).g;
  float b = texture2D(uCover, uv - vec2(split, 0.0)).b;
  return vec3(r, g, b);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.05;

  vec2 center = (uRect.xy + uRect.zw * 0.5);
  vec2 cp = vec2(center.x / uRes.x * aspect, center.y / uRes.y);

  // Kick shockwave travelling out from the cover
  float dist = length(p - cp);
  float ring = exp(-pow((dist - uKickAge * 1.6) * 9.0, 2.0)) * exp(-uKickAge * 3.5);
  p += normalize(p - cp + 0.0001) * ring * 0.035;

  // Domain-warped flow
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 5.2));
  vec2 r = vec2(fbm(p * 1.5 + 2.6 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.5 + 2.6 * q + vec2(8.3, 2.8) - t));
  float n = fbm(p * 1.5 + 3.0 * r);

  vec3 art = texture2D(uArt, clamp(uv + (r - 0.5) * 0.42, 0.0, 1.0)).rgb;
  vec3 col = BASE + art * 0.30 * uReady;
  col += PURPLE * pow(n, 3.0) * 0.6;
  col += PURPLE * ring * 0.35;

  // Neural contours
  float iso = abs(fract(n * 9.0 - uTime * 0.09) - 0.5);
  float line = smoothstep(0.04, 0.0, iso) * smoothstep(0.3, 0.75, n);
  col += GREEN * line * (0.07 + 0.5 * uKick);

  // Cover specimen
  vec2 local = (frag - uRect.xy) / uRect.zw;
  vec2 hb = uRect.zw * 0.5;
  float box = sdBox(frag - center, hb);

  float zoom = 1.0 - 0.03 * uKick;
  vec2 cuv = (local - 0.5) * zoom + 0.5;

  float tick = floor(uTime * 14.0);
  float row = floor(cuv.y * 22.0);
  float slice = step(0.6, hash(vec2(row * 1.37, tick)));
  cuv.x += (hash(vec2(row, tick)) - 0.5) * 0.14 * uSnare * slice;

  vec2 mloc = (uMouse - uRect.xy) / uRect.zw;
  float md = length((frag - uMouse) / uRect.z);
  float lens = uMouseOn * smoothstep(0.22, 0.0, md);
  cuv = mix(cuv, mloc + (cuv - mloc) * 0.72, lens);

  float split = 0.003 + 0.025 * uSnare + 0.018 * lens;
  vec3 cover = sampleCover(clamp(cuv, 0.0, 1.0), split);
  cover += CRIMSON * slice * uSnare * 0.18;
  cover *= 1.0 + uKick * 0.12;

  // Scan-in reveal of the cover during intro
  float sweep = smoothstep(local.y - 0.02, local.y, uIntro * 1.15 - 0.1);
  float inside = step(box, 0.0) * uReady;
  col = mix(col, cover, inside * sweep);
  float sweepLine = inside * smoothstep(0.012, 0.0, abs(local.y - (uIntro * 1.15 - 0.1))) * (1.0 - uIntro);
  col += GREEN * sweepLine;

  // Rim glow around the cover
  float outside = max(box, 0.0);
  col += PURPLE * exp(-outside / (14.0 + 30.0 * uKick)) * (0.35 + 0.65 * uKick) * step(0.0, box) * uReady;

  // Intro: static resolving into signal
  float st = hash(frag * 0.5 + fract(uTime) * 100.0);
  float reveal = 1.0 - smoothstep(uIntro * 1.15 - 0.15, uIntro * 1.15, n * 0.9 + 0.05);
  col = mix(col, vec3(st) * vec3(0.4, 0.5, 0.45) * 0.4, (1.0 - reveal) * (1.0 - uIntro * 0.2));

  // Film: scanlines, grain, vignette
  col *= 0.94 + 0.06 * sin(frag.y * 1.6);
  col += (hash(frag + fract(uTime * 7.0)) - 0.5) * 0.045;
  vec2 vv = uv - 0.5;
  col *= 1.0 - dot(vv, vv) * 0.9;
  col = mix(col, vec3(0.0), smoothstep(0.12, 0.0, uv.y));

  gl_FragColor = vec4(col, 1.0);
}
`

type Props = {
  coverSrc: string
  artSrc: string
  slotRef: RefObject<HTMLElement | null>
  rootRef: RefObject<HTMLElement | null>
  onReady?: () => void
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('[SignalField] shader error', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

function lastHitAge(pos: number, hits: number[]) {
  // pos: position within the bar in beats (0..4). Returns age in seconds.
  let best = Infinity
  for (const h of hits) {
    const d = (pos - h + 4) % 4
    if (d < best) best = d
  }
  return best * BEAT
}

export default function SignalField({ coverSrc, artSrc, slotRef, rootRef, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(prog, name)
    const U = {
      res: u('uRes'), time: u('uTime'), intro: u('uIntro'), kick: u('uKick'), kickAge: u('uKickAge'),
      snare: u('uSnare'), rect: u('uRect'), mouse: u('uMouse'), mouseOn: u('uMouseOn'), ready: u('uReady'),
      cover: u('uCover'), art: u('uArt'),
    }

    const makeTex = (unit: number) => {
      const tex = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([11, 11, 15, 255]))
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      return tex
    }
    const coverTex = makeTex(0)
    const artTex = makeTex(1)
    gl.uniform1i(U.cover, 0)
    gl.uniform1i(U.art, 1)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let ready = 0
    let pending = artSrc === coverSrc ? 1 : 2
    let introStart = -1

    const load = (src: string, unit: number, tex: WebGLTexture | null, alsoUnit?: number) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        for (const un of alsoUnit === undefined ? [unit] : [unit, alsoUnit]) {
          gl.activeTexture(gl.TEXTURE0 + un)
          gl.bindTexture(gl.TEXTURE_2D, un === unit ? tex : artTex)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        }
        pending -= 1
        if (pending <= 0) {
          ready = 1
          introStart = performance.now()
          onReadyRef.current?.()
          if (reduce) draw(performance.now())
        }
      }
      img.src = src
    }
    if (artSrc === coverSrc) load(coverSrc, 0, coverTex, 1)
    else {
      load(coverSrc, 0, coverTex)
      load(artSrc, 1, artTex)
    }

    let dpr = 1
    const resize = () => {
      const small = window.innerWidth < 768
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      if (reduce) draw(performance.now())
    }

    const mouse = { x: -9999, y: -9999, on: 0, target: 0 }
    const host = canvas.parentElement
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) * dpr
      mouse.y = (r.bottom - e.clientY) * dpr
      mouse.target = 1
    }
    const onLeave = () => { mouse.target = 0 }
    host?.addEventListener('pointermove', onMove)
    host?.addEventListener('pointerleave', onLeave)

    const t0 = performance.now()
    let raf = 0
    let visible = true

    const draw = (now: number) => {
      const time = reduce ? 12 : (now - t0) / 1000
      const intro = reduce ? 1 : introStart < 0 ? 0 : Math.min(1, (now - introStart) / 1600)
      const pos = (time / BEAT) % 4
      const kickAge = reduce ? 10 : lastHitAge(pos, KICKS)
      const snareAge = reduce ? 10 : lastHitAge(pos, SNARES)
      const kick = Math.exp(-kickAge * 9) * intro
      const snare = Math.exp(-snareAge * 14) * intro

      mouse.on += (mouse.target - mouse.on) * 0.12

      const cr = canvas!.getBoundingClientRect()
      const slot = slotRef.current?.getBoundingClientRect()
      const rect = slot
        ? [
            (slot.left - cr.left) * dpr,
            (cr.bottom - slot.bottom) * dpr,
            slot.width * dpr,
            slot.height * dpr,
          ]
        : [-10, -10, 1, 1]

      gl.uniform2f(U.res, canvas!.width, canvas!.height)
      gl.uniform1f(U.time, time)
      gl.uniform1f(U.intro, intro)
      gl.uniform1f(U.kick, kick)
      gl.uniform1f(U.kickAge, kickAge)
      gl.uniform1f(U.snare, snare)
      gl.uniform4f(U.rect, rect[0], rect[1], rect[2], rect[3])
      gl.uniform2f(U.mouse, mouse.x, mouse.y)
      gl.uniform1f(U.mouseOn, mouse.on)
      gl.uniform1f(U.ready, ready)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      const root = rootRef.current
      if (root) {
        root.style.setProperty('--kick', kick.toFixed(3))
        root.style.setProperty('--snare', snare.toFixed(3))
      }
    }

    const loop = (now: number) => {
      if (disposed) return
      if (visible && !document.hidden) draw(now)
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(canvas)

    if (!reduce) raf = requestAnimationFrame(loop)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host?.removeEventListener('pointermove', onMove)
      host?.removeEventListener('pointerleave', onLeave)
      gl.deleteTexture(coverTex)
      gl.deleteTexture(artTex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [coverSrc, artSrc, slotRef, rootRef])

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}
