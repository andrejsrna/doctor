'use client'

import { useEffect, useRef } from 'react'

/**
 * One sticky full-viewport shader behind a long section (release outro, home latest releases).
 * Scroll progress (0..1 through the outro) drives the palette and field drift;
 * a 174 BPM two-step clock drives kick/snare envelopes, also exported as
 * CSS vars (--kick / --snare) on rootRef so DOM pulses share the clock.
 */

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'

const FRAG = `
precision mediump float;
uniform vec2 R;
uniform float T,S,K,N,W;
uniform vec2 M;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*nz(p);p=p*2.03+17.;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/R;
  vec2 p=(gl_FragCoord.xy-.5*R)/R.y;
  // snare: horizontal tear bands
  float row=floor(uv.y*34.);
  float band=step(.9,h(vec2(row,floor(T*11.6))));
  p.x+=band*N*.09*(h(vec2(row,T))-.5);
  // pointer lens
  vec2 d=p-M; p-=d*.18*exp(-dot(d,d)*7.);
  // domain-warped infection field, drifting with scroll
  vec2 q=vec2(fbm(p*1.5+vec2(0.,T*.04+S*2.)),fbm(p*1.5+vec2(5.2,-T*.035)));
  float f=fbm(p*2.1+q*2.6+vec2(S*4.,0.));
  float c=abs(fract(f*8.-T*.25-S*6.)-.5);
  float line=smoothstep(.045,0.,c);
  // perspective floor rushing toward the viewer at tempo
  float g=0.;
  float y=p.y+.2;
  if(y<0.){
    float z=.32/(-y);
    vec2 gp=vec2(p.x*z,z+T*1.45);
    vec2 gl=abs(fract(gp)-.5);
    g=smoothstep(.47,.5,max(gl.x,gl.y))*smoothstep(9.,1.2,z);
  }
  vec3 G=vec3(.224,1.,.078),P=vec3(.608,.369,1.),C=vec3(1.,0.,.302);
  // palette walk: green -> purple -> (crimson when W=1) -> green
  vec3 a=mix(G,P,smoothstep(.15,.4,S));
  a=mix(a,C,W*smoothstep(.5,.62,S)*(1.-smoothstep(.72,.84,S)));
  a=mix(a,G,smoothstep(.84,1.,S));
  vec3 b=mix(P,G,smoothstep(.3,.9,S));
  vec3 col=vec3(.012,.012,.02);
  col+=b*f*f*.2;
  col+=a*line*(.16+K*.42);
  col+=a*g*(.22+K*.5);
  col+=a*K*.03;
  col.r+=band*N*.12;
  col*=.86+.14*sin(gl_FragCoord.y*1.7);
  col*=1.-.6*length(uv-.5);
  gl_FragColor=vec4(col,1.);
}`

const BPS = 174 / 60

function envelopes(t: number) {
  const beat = (t * BPS) % 4
  const hit = (at: number, decay: number) => {
    const d = beat - at
    return d >= 0 && d < 1 ? Math.exp(-d * decay) : 0
  }
  return {
    kick: Math.max(hit(0, 7), hit(2.5, 7)),
    snare: Math.max(hit(1, 9), hit(3, 9)),
  }
}

export default function SignalBackdrop({ rootRef, crimson = true }: { rootRef: React.RefObject<HTMLElement | null>; crimson?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return
    // A lost context paints as a blank (white) layer: hide it and let the dark root show.
    const onLost = () => { canvas.style.visibility = 'hidden' }
    canvas.addEventListener('webglcontextlost', onLost)
    if (gl.isContextLost()) onLost()

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl.getUniformLocation(prog, n)
    const uR = u('R'), uT = u('T'), uS = u('S'), uK = u('K'), uN = u('N'), uM = u('M')
    gl.uniform1f(u('W'), crimson ? 1 : 0)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: 9, y: 9, tx: 9, ty: 9 }

    const resize = () => {
      // background field: cheap resolution is fine
      const scale = Math.min(window.devicePixelRatio || 1, 1) * (window.innerWidth < 768 ? 0.6 : 0.75)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const progress = () => {
      const r = root.getBoundingClientRect()
      const span = Math.max(1, r.height - window.innerHeight)
      return Math.min(1, Math.max(0, -r.top / span))
    }

    const draw = (t: number) => {
      const { kick, snare } = reduce ? { kick: 0, snare: 0 } : envelopes(t)
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.uniform1f(uT, t)
      gl.uniform1f(uS, progress())
      gl.uniform1f(uK, kick)
      gl.uniform1f(uN, snare)
      gl.uniform2f(uM, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      root.style.setProperty('--kick', kick.toFixed(3))
      root.style.setProperty('--snare', snare.toFixed(3))
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.tx = (e.clientX - r.left - r.width / 2) / r.height
      mouse.ty = -(e.clientY - r.top - r.height / 2) / r.height
    }
    root.addEventListener('pointermove', onMove)

    let raf = 0
    let visible = false
    const start = performance.now()
    const loop = () => {
      draw((performance.now() - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    const sync = () => {
      cancelAnimationFrame(raf)
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (reduce && visible) draw(4)
      sync()
    })
    io.observe(root)
    document.addEventListener('visibilitychange', sync)
    const onScroll = () => { if (reduce && visible) draw(4) }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', sync)
      root.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('webglcontextlost', onLost)
      // Free GPU objects but keep the context: StrictMode re-runs this effect on the same canvas.
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [rootRef, crimson])

  return <canvas ref={canvasRef} />
}
