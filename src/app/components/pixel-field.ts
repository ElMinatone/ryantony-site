import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  viewChild,
  afterNextRender,
} from '@angular/core';

interface Point {
  x: number;
  y: number;
  seed: number;
}

@Component({
  selector: 'app-pixel-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: block;
      overflow: hidden;
      pointer-events: none;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0.9;
    }
  `,
})
export class PixelFieldComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx?: CanvasRenderingContext2D;
  private points: Point[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private reducedMotion = false;
  private lastFrame = 0;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private pointerX = -9999;
  private pointerY = -9999;
  private targetX = -9999;
  private targetY = -9999;

  constructor() {
    afterNextRender(() => this.init());
  }

  ngAfterViewInit(): void {
    // The canvas is initialized in afterNextRender; this lifecycle hook keeps
    // the component compatible with strict template checking.
  }

  ngOnDestroy(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private init(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.ctx = ctx;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host.nativeElement);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !this.running && !this.reducedMotion) {
          this.start();
        } else if (!visible) {
          this.stop();
        }
      },
      { threshold: 0 },
    );
    this.intersectionObserver.observe(this.host.nativeElement);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    this.resize();
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));

    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);

    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    this.buildPoints();
    if (this.reducedMotion) {
      this.draw(0);
    }
  }

  private buildPoints(): void {
    const spacing = this.width < 720 ? 30 : 27;
    const points: Point[] = [];

    for (let y = spacing / 2; y < this.height; y += spacing) {
      for (let x = spacing / 2; x < this.width; x += spacing) {
        points.push({
          x,
          y,
          seed: Math.sin(x * 12.9898 + y * 78.233) * 43758.5453,
        });
      }
    }

    this.points = points;
  }

  private start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastFrame = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private readonly onVisibility = (): void => {
    if (document.hidden) {
      this.stop();
    } else if (this.isInViewport()) {
      this.start();
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    this.targetX = event.clientX - rect.left;
    this.targetY = event.clientY - rect.top;
  };

  private isInViewport(): boolean {
    const rect = this.host.nativeElement.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  private readonly loop = (time: number): void => {
    if (!this.running) {
      return;
    }
    if (time - this.lastFrame > 32) {
      this.draw(time);
      this.lastFrame = time;
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private draw(time: number): void {
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.width, this.height);

    if (!this.reducedMotion) {
      this.pointerX += (this.targetX - this.pointerX) * 0.1;
      this.pointerY += (this.targetY - this.pointerY) * 0.1;
    }

    const radius = this.width < 720 ? 130 : 185;
    const radiusSq = radius * radius;
    const wave = time * 0.00055;

    for (const point of this.points) {
      const dx = point.x - this.pointerX;
      const dy = point.y - this.pointerY;
      const distSq = dx * dx + dy * dy;
      const falloff = distSq < radiusSq ? 1 - Math.sqrt(distSq) / radius : 0;
      const flicker = Math.sin(wave + point.seed) * 0.012;

      let alpha = 0.055 + flicker + falloff * 0.55;
      let size = 1.5;
      let color = "255, 255, 255";

      if (falloff > 0.08) {
        color = "192, 255, 107";
        size += falloff * 2.6;
        alpha = 0.08 + falloff * 0.65;
      } else if (point.seed > 0.93) {
        color = "192, 255, 107";
        alpha = 0.16;
      } else if (point.seed > 0.82) {
        color = "213, 213, 213";
        alpha = 0.11;
      }

      ctx.fillStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
      const x = Math.round(point.x);
      const y = Math.round(point.y);
      ctx.fillRect(x, y, size, size);
    }
  }
}
