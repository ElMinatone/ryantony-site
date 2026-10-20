import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

const DESKTOP_QUERY = '(min-width: 1100px) and (hover: hover) and (pointer: fine)';

const GLYPHS = [
  ' ', '.', ',', '`', ':', ';', '-', '~',
  '-', '/', '|', '\\', '=', '/', '|', '\\',
  '=', '+', '*', 'x', 'o', ':', '~', '#',
  '#', '%', '@', '8', 'W', 'M', '&', '$',
  '~', '^', '*', '%', '#', '+', ':', '.',
  '@', '#', '%', 'W', '*', '+', '=', '-',
  ' ', '.', '-', '_', ':', "'", '~', '=',
  '+', 'x', '*', ':', '.', 'o', '#', '~',
];

const VERT = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform float uCell;
uniform float uVoyage;
uniform float uWake;
uniform vec2 uPointer;
uniform sampler2D uFont;

const float PI = 3.14159265;
const float TAU = 6.2831853;
const vec3 BRAND = vec3(0.753, 1.0, 0.420);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec4 wave(vec2 xz, float t, vec2 D, float A, float L, float S, float Q) {
  D = normalize(D);
  float w = TAU / L;
  float phase = w * dot(D, xz) + S * w * t;
  float s = sin(phase);
  float c = cos(phase);
  float WA = w * A;
  return vec4(-D.x * WA * c, Q * WA * s, -D.y * WA * c, A * s);
}

void accumulate(inout vec3 N, inout float h, inout float steep, vec4 w) {
  N.x += w.x;
  N.y -= w.y;
  N.z += w.z;
  h += w.w;
  steep += w.y;
}

float glyphIndex(float light, float spec, float foam, float caustic, vec3 N, float sky, float skyLum, float star) {
  if (sky > 0.5) {
    if (star > 0.5) return 49.0;
    return 48.0 + floor(clamp(skyLum, 0.0, 0.999) * 8.0);
  }
  if (spec > 0.4) return 40.0 + floor(clamp(spec, 0.0, 0.999) * 8.0);
  if (foam > 0.46) return 32.0 + floor(clamp(foam, 0.0, 0.999) * 8.0);
  if (caustic > 0.62 && light < 0.34) return 56.0 + floor(clamp(caustic, 0.0, 0.999) * 8.0);

  float L = clamp(light, 0.0, 0.999);
  if (L < 0.2) return floor(L / 0.2 * 8.0);
  if (L < 0.46) {
    float oct = floor(mod(atan(N.x, N.z) + PI, TAU) / TAU * 8.0);
    return 8.0 + oct;
  }
  if (L < 0.72) return 16.0 + floor((L - 0.46) / 0.26 * 8.0);
  return 24.0 + floor((L - 0.72) / 0.28 * 8.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float aspect = uResolution.x / uResolution.y;
  float t = uTime * 0.68;

  float horizon = 0.78 + sin(t * 0.31) * 0.006;
  vec2 ptr = clamp(uPointer, vec2(0.0), vec2(1.0));
  horizon += (ptr.y - 0.5) * 0.035;

  float sy0 = frag.y / uResolution.y;
  float sx0 = frag.x / uResolution.x;
  float waterH = horizon - sy0;
  float lod = 1.0;
  if (waterH > 0.0 && waterH < 0.028) lod = 3.0;
  else if (waterH > 0.0 && waterH < 0.11) lod = 2.0;

  float cell = max(uCell * lod, 1.0);
  vec2 q = floor(frag / cell) * cell + cell * 0.5;
  float sx = q.x / uResolution.x;
  float sy = q.y / uResolution.y;

  float yaw = (ptr.x - 0.5) * 0.22;
  float cy = cos(yaw);
  float syaw = sin(yaw);

  vec3 col = vec3(0.0);
  float light = 0.0;
  float spec = 0.0;
  float foam = 0.0;
  float caustic = 0.0;
  float skyLum = 0.0;
  float star = 0.0;
  vec3 N = vec3(0.0, 1.0, 0.0);
  float sky = step(horizon, sy);

  if (sky > 0.5) {
    float skyT = clamp((sy - horizon) / max(1.0 - horizon, 0.001), 0.0, 1.0);
    vec3 zenith = vec3(0.004, 0.006, 0.004);
    vec3 dusk = vec3(0.045, 0.07, 0.02);
    col = mix(dusk, zenith, smoothstep(0.0, 0.72, skyT));

    float moonX = 0.62 + sin(t * 0.07) * 0.035;
    float moonY = horizon + 0.055;
    vec2 moon = vec2(moonX, moonY);
    float md = length((vec2(sx, sy) - moon) * vec2(aspect, 1.0));
    float disk = smoothstep(0.045, 0.012, md);
    float halo = exp(-md * 16.0);
    col += BRAND * halo * 0.55;
    col += vec3(0.9, 1.0, 0.78) * disk;

    float ray = pow(max(0.0, 1.0 - abs(sx - moonX) * 2.8), 5.0) * exp(-skyT * 2.4);
    float shaft = 0.65 + 0.35 * sin(sx * 90.0 + t * 0.4);
    col += BRAND * ray * shaft * 0.22;

    float cloud = sin(sx * 7.5 + t * 0.08) * sin(sx * 2.4 - 1.7);
    cloud = smoothstep(0.15, 0.85, cloud) * exp(-skyT * 7.0);
    col += vec3(0.03, 0.045, 0.015) * cloud;

    skyLum = clamp(dot(col, vec3(0.3, 0.5, 0.2)) * 2.4, 0.0, 1.0);
    star = step(0.9982, hash(floor(q / cell)));
    if (star > 0.5 && skyT > 0.18) {
      col += vec3(0.55, 0.62, 0.4);
      skyLum = max(skyLum, 0.35);
    }
  } else {
    float py = max(horizon - sy, 0.004) / horizon;
    float z = 0.72 / pow(py, 1.18);
    float x = (sx - 0.5) * aspect * z * 0.92;
    vec2 xz = vec2(x, z + uVoyage);
    xz = mat2(cy, syaw, -syaw, cy) * xz;

    float ptrPy = max(horizon - ptr.y, 0.02) / horizon;
    float ptrZ = 0.72 / pow(ptrPy, 1.18);
    float ptrX = (ptr.x - 0.5) * aspect * ptrZ * 0.92;
    vec2 pxz = mat2(cy, syaw, -syaw, cy) * vec2(ptrX, ptrZ + uVoyage);
    float wakeD = length(xz - pxz);
    float wake = sin(wakeD * 8.5 - t * 5.2) * exp(-wakeD * 0.38);
    wake += sin(wakeD * 18.0 - t * 7.4) * exp(-wakeD * 0.72) * 0.4;
    wake *= uWake * step(ptr.y, horizon + 0.02);

    float h = 0.0;
    float steep = 0.0;
    N = vec3(0.0, 1.0, 0.0);
    accumulate(N, h, steep, wave(xz, t, vec2(0.16, 0.99), 0.30, 18.0, 0.58, 0.34));
    accumulate(N, h, steep, wave(xz, t, vec2(0.86, 0.51), 0.16, 9.2, 0.86, 0.5));
    accumulate(N, h, steep, wave(xz, t, vec2(0.55, 0.84), 0.09, 4.4, 1.18, 0.66));
    accumulate(N, h, steep, wave(xz, t, vec2(-0.35, 0.94), 0.055, 2.35, 1.62, 0.74));
    accumulate(N, h, steep, wave(xz, t, vec2(0.97, 0.24), 0.12, 7.1, 1.02, 0.48));
    accumulate(N, h, steep, wave(xz, t, vec2(-0.72, 0.69), 0.034, 1.45, 2.05, 0.6));
    accumulate(N, h, steep, wave(xz, t, vec2(0.42, -0.91), 0.08, 12.5, 0.66, 0.4));

    float near = smoothstep(18.0, 1.4, z);
    float rip = sin(xz.x * 5.4 + t * 2.1) * sin(xz.y * 4.6 - t * 1.55);
    h += rip * 0.014 * near + wake * 0.055;
    N.x += cos(xz.x * 5.4 + t * 2.1) * sin(xz.y * 4.6 - t * 1.55) * 0.07 * near;
    N.x += cos(wakeD * 8.5 - t * 5.2) * 0.22 * uWake * exp(-wakeD * 0.38);
    N = normalize(N);

    vec3 V = normalize(vec3(-(sx - 0.5) * aspect * 0.32, 0.46, -1.0));
    vec3 sun = normalize(vec3(sin(t * 0.07) * 0.55 + 0.18, 0.2, -0.86));
    vec3 fill = normalize(vec3(-0.72, 0.34, -0.28));

    float ndl = clamp(dot(N, sun), 0.0, 1.0);
    float wrap = clamp(dot(N, sun) * 0.45 + 0.55, 0.0, 1.0);
    float fillL = clamp(dot(N, fill), 0.0, 1.0) * 0.28;
    spec = pow(clamp(dot(reflect(-sun, N), V), 0.0, 1.0), mix(36.0, 96.0, near));
    float spec2 = pow(clamp(dot(reflect(-fill, N), V), 0.0, 1.0), 18.0) * 0.22;
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 4.0);
    float sss = pow(clamp(dot(-sun, V), 0.0, 1.0), 2.6) * smoothstep(-0.02, 0.2, h);

    float crest = smoothstep(0.08, 0.24, h) * smoothstep(0.42, 1.05, steep);
    float breakup = 0.55 + 0.45 * sin(xz.x * 3.4 + xz.y * 2.2 + t * 0.8);
    foam = crest * breakup * smoothstep(0.04, 0.28, py);

    float c1 = sin(xz.x * 2.8 + t * 1.25 + h * 7.0);
    float c2 = sin(xz.y * 2.4 - t * 0.95 + h * 5.0);
    caustic = pow(abs(c1 * c2), 1.6) * near * (1.0 - smoothstep(0.05, 0.22, h));

    vec3 deep = vec3(0.008, 0.012, 0.007);
    vec3 body = vec3(0.035, 0.07, 0.02);
    vec3 lit = vec3(0.16, 0.3, 0.07);
    col = mix(deep, body, wrap);
    col = mix(col, lit, ndl * 0.9 + fillL);
    col += BRAND * spec * 1.25;
    col += vec3(0.9, 1.0, 0.75) * pow(spec, 2.2);
    col += vec3(0.12, 0.24, 0.07) * spec2;
    col += vec3(0.18, 0.34, 0.08) * sss * 0.7;
    col += vec3(0.1, 0.16, 0.05) * fres * (1.0 - near * 0.7);
    col += vec3(0.62, 0.78, 0.4) * foam;
    col += BRAND * caustic * 0.16;

    float moonX = 0.62 + sin(t * 0.07) * 0.035;
    float refl = exp(-abs(sx - moonX) * aspect * 6.5);
    refl *= 0.28 + 0.72 * spec;
    refl *= exp(-z * 0.018);
    col += BRAND * refl * 0.85;
    col += vec3(0.85, 1.0, 0.7) * refl * spec;

    float fog = exp(-z * 0.034);
    vec3 air = vec3(0.055, 0.082, 0.028);
    col = mix(air, col, fog);
    float hz = exp(-abs(sy - horizon) * 70.0);
    col += BRAND * hz * 0.28;

    light = clamp(wrap * 0.42 + ndl * 0.7 + fillL + spec * 1.35 + foam * 0.85 + fres * 0.2, 0.0, 1.35);
    light *= mix(0.55, 1.0, fog);
    light += refl * 0.45;
  }

  float dither = hash(floor(q / cell)) - 0.5;
  light = clamp(light + dither * 0.045, 0.0, 1.0);
  float index = glyphIndex(light, spec, foam, caustic, N, sky, skyLum, star);

  vec2 local = fract(frag / cell);
  vec2 g = local * 0.84 + 0.08;
  float cols = 8.0;
  vec2 atlas = vec2(mod(index, cols), floor(index / cols));
  vec2 uv = (atlas + g) / cols;
  vec4 tex = texture(uFont, uv);
  float alpha = smoothstep(0.18, 0.62, max(tex.a, max(tex.r, max(tex.g, tex.b))));

  vec3 paper = col * 0.07;
  vec3 rgb = mix(paper, col * 1.18, alpha);

  vec2 vg = vec2(sx0, sy0) * 2.0 - 1.0;
  float vig = smoothstep(1.35, 0.28, length(vg * vec2(0.72, 0.92)));
  rgb *= mix(0.42, 1.0, vig);
  rgb = rgb / (1.0 + max(rgb - vec3(0.82), 0.0) * 0.55);

  fragColor = vec4(rgb, 1.0);
}
`;

@Component({
  selector: 'app-ascii-ocean',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  host: {
    'aria-hidden': 'true',
  },
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: none;
      overflow: hidden;
      pointer-events: none;
    }

    :host.is-on {
      display: block;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    @media print {
      :host {
        display: none !important;
      }
    }
  `,
})
export class AsciiOceanComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private desktopQuery?: MediaQueryList;
  private reducedQuery?: MediaQueryList;
  private resizeObserver?: ResizeObserver;
  private gl?: WebGL2RenderingContext;
  private program?: WebGLProgram;
  private font?: WebGLTexture;
  private buffer?: WebGLBuffer;
  private raf = 0;
  private running = false;
  private reduced = false;
  private contextLost = false;
  private width = 0;
  private height = 0;
  private cell = 12;
  private quality = 1;
  private slowFrames = 0;
  private time = 8.4;
  private voyage = 0;
  private lastScroll = 0;
  private wake = 0;
  private pointer = { x: 0.62, y: 0.42 };
  private pointerTarget = { x: 0.62, y: 0.42 };
  private inside = false;
  private lastFrame = 0;
  private uniforms?: {
    resolution: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    cell: WebGLUniformLocation | null;
    voyage: WebGLUniformLocation | null;
    wake: WebGLUniformLocation | null;
    pointer: WebGLUniformLocation | null;
    font: WebGLUniformLocation | null;
  };

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => this.mount());
    });
  }

  ngOnDestroy(): void {
    this.stop();
    this.desktopQuery?.removeEventListener('change', this.onDesktopChange);
    this.reducedQuery?.removeEventListener('change', this.onReducedChange);
  }

  private mount(): void {
    this.desktopQuery = window.matchMedia(DESKTOP_QUERY);
    this.reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = this.reducedQuery.matches;
    this.desktopQuery.addEventListener('change', this.onDesktopChange);
    this.reducedQuery.addEventListener('change', this.onReducedChange);
    this.sync();
  }

  private readonly onDesktopChange = (): void => this.sync();

  private readonly onReducedChange = (): void => {
    this.reduced = this.reducedQuery?.matches ?? false;
    if (this.reduced) {
      this.time = 14.2;
      this.draw(this.time);
    }
  };

  private sync(): void {
    if (this.desktopQuery?.matches) {
      this.start();
      return;
    }
    this.stop();
  }

  private start(): void {
    if (this.running) {
      return;
    }

    const canvas = this.canvasRef().nativeElement;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });

    if (!gl) {
      return;
    }

    const program = this.createProgram(gl, VERT, FRAG);
    if (!program) {
      return;
    }

    this.gl = gl;
    this.program = program;
    this.buffer = this.createTriangle(gl);
    this.font = this.createFont(gl);
    this.uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
      cell: gl.getUniformLocation(program, 'uCell'),
      voyage: gl.getUniformLocation(program, 'uVoyage'),
      wake: gl.getUniformLocation(program, 'uWake'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      font: gl.getUniformLocation(program, 'uFont'),
    };

    canvas.addEventListener('webglcontextlost', this.onContextLost);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerleave', this.onPointerLeave);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host.nativeElement);

    this.running = true;
    this.contextLost = false;
    this.lastScroll = window.scrollY || 0;
    this.host.nativeElement.classList.add('is-on');
    document.documentElement.classList.add('has-ascii-ocean');
    canvas.dataset['renderer'] = 'webgl';
    this.resize();
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibility);

    const canvas = this.canvasRef()?.nativeElement;
    canvas?.removeEventListener('webglcontextlost', this.onContextLost);
    canvas?.removeEventListener('webglcontextrestored', this.onContextRestored);

    const gl = this.gl;
    if (gl) {
      if (this.program) gl.deleteProgram(this.program);
      if (this.font) gl.deleteTexture(this.font);
      if (this.buffer) gl.deleteBuffer(this.buffer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    this.gl = undefined;
    this.program = undefined;
    this.font = undefined;
    this.buffer = undefined;
    this.uniforms = undefined;
    this.host.nativeElement.classList.remove('is-on');
    document.documentElement.classList.remove('has-ascii-ocean');
  }

  private readonly onContextLost = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
    cancelAnimationFrame(this.raf);
  };

  private readonly onContextRestored = (): void => {
    this.contextLost = false;
    if (this.running) {
      this.raf = requestAnimationFrame(this.frame);
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    const rect = this.host.nativeElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }
    this.pointerTarget.x = (event.clientX - rect.left) / rect.width;
    this.pointerTarget.y = 1 - (event.clientY - rect.top) / rect.height;
    this.inside = true;
  };

  private readonly onPointerLeave = (): void => {
    this.inside = false;
  };

  private readonly onVisibility = (): void => {
    if (!this.running) {
      return;
    }
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      return;
    }
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  };

  private readonly frame = (now: number): void => {
    if (!this.running || this.contextLost) {
      return;
    }

    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;

    if (dt > 0.022) {
      this.slowFrames += 1;
    } else {
      this.slowFrames = Math.max(0, this.slowFrames - 1);
    }

    if (this.slowFrames > 20 && this.quality > 0.62) {
      this.quality = Math.max(0.62, this.quality * 0.8);
      this.slowFrames = 0;
      this.resize();
    }

    const scroll = window.scrollY || 0;
    const delta = scroll - this.lastScroll;
    this.lastScroll = scroll;

    if (!this.reduced && !document.hidden && !document.body.classList.contains('has-modal')) {
      this.time += dt;
      this.voyage = (this.voyage + dt * 0.42 + delta * 0.0035) % 400;
    }

    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.045;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.045;
    const wakeTarget = this.inside ? 1 : 0;
    this.wake += (wakeTarget - this.wake) * 0.04;

    this.draw(this.reduced ? 14.2 : this.time);
    this.raf = requestAnimationFrame(this.frame);
  };

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    const rect = this.host.nativeElement.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const cssH = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * this.quality;
    let w = Math.max(1, Math.floor(cssW * dpr));
    let h = Math.max(1, Math.floor(cssH * dpr));
    const maxEdge = 3840;
    const edge = Math.max(w, h);
    if (edge > maxEdge) {
      const scale = maxEdge / edge;
      w = Math.max(1, Math.floor(w * scale));
      h = Math.max(1, Math.floor(h * scale));
    }

    this.width = w;
    this.height = h;
    const cssCell = cssW >= 2200 ? 9 : cssW >= 1600 ? 10 : 12;
    this.cell = Math.max(6, Math.round(cssCell * (w / cssW)));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    this.gl?.viewport(0, 0, w, h);
    this.draw(this.reduced ? 14.2 : this.time);
  }

  private draw(time: number): void {
    const gl = this.gl;
    const uniforms = this.uniforms;
    if (!gl || !this.program || !this.buffer || !uniforms || this.contextLost) {
      return;
    }

    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    const pos = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.font ?? null);
    gl.uniform2f(uniforms.resolution, this.width, this.height);
    gl.uniform1f(uniforms.time, time);
    gl.uniform1f(uniforms.cell, this.cell);
    gl.uniform1f(uniforms.voyage, this.voyage);
    gl.uniform1f(uniforms.wake, this.wake);
    gl.uniform2f(uniforms.pointer, this.pointer.x, this.pointer.y);
    gl.uniform1i(uniforms.font, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private createTriangle(gl: WebGL2RenderingContext): WebGLBuffer | undefined {
    const buffer = gl.createBuffer();
    if (!buffer) {
      return undefined;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    return buffer;
  }

  private createFont(gl: WebGL2RenderingContext): WebGLTexture | undefined {
    const texture = gl.createTexture();
    if (!texture) {
      return undefined;
    }
    this.uploadFont(gl, texture);
    void document.fonts?.ready.then(() => {
      if (this.gl && this.font) {
        this.uploadFont(this.gl, this.font);
      }
    });
    return texture;
  }

  private uploadFont(gl: WebGL2RenderingContext, texture: WebGLTexture): void {
    const size = 64;
    const cols = 8;
    const atlas = document.createElement('canvas');
    atlas.width = cols * size;
    atlas.height = cols * size;
    const ctx = atlas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, atlas.width, atlas.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const family = document.fonts?.check('500 48px "JetBrains Mono"')
      ? 'JetBrains Mono'
      : 'Consolas, monospace';
    ctx.font = `500 ${Math.floor(size * 0.68)}px ${family}`;

    for (let i = 0; i < GLYPHS.length; i += 1) {
      const glyph = GLYPHS[i];
      if (!glyph || glyph === ' ') {
        continue;
      }
      const x = (i % cols) * size + size / 2;
      const y = Math.floor(i / cols) * size + size / 2 + size * 0.02;
      ctx.fillText(glyph, x, y);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  private createProgram(
    gl: WebGL2RenderingContext,
    vert: string,
    frag: string,
  ): WebGLProgram | undefined {
    const program = gl.createProgram();
    const vs = this.compile(gl, gl.VERTEX_SHADER, vert);
    const fs = this.compile(gl, gl.FRAGMENT_SHADER, frag);
    if (!program || !vs || !fs) {
      return undefined;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'aPos');
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return undefined;
    }

    return program;
  }

  private compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | undefined {
    const shader = gl.createShader(type);
    if (!shader) {
      return undefined;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return undefined;
    }
    return shader;
  }
}
