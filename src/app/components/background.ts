import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsciiOceanComponent } from './ascii-ocean';

@Component({
  selector: 'app-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsciiOceanComponent],
  template: `
    <div class="bg" aria-hidden="true">
      <app-ascii-ocean />
      <div class="bg-grid"></div>
      <div class="bg-pixels"></div>
      <div class="glow glow--a"></div>
      <div class="glow glow--b"></div>
      <div class="glow glow--c"></div>
      <div class="scanline"></div>
      <div class="ocean-scrim"></div>
      <div class="vignette"></div>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .bg {
      position: absolute;
      inset: 0;
      background: #000;
    }

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: radial-gradient(ellipse 90% 65% at 50% 0%, #000 20%, transparent 78%);
      -webkit-mask-image: radial-gradient(ellipse 90% 65% at 50% 0%, #000 20%, transparent 78%);
      opacity: 0.55;
    }

    .bg-pixels {
      position: absolute;
      inset: 0;
      background-image: url('/images/pixel-pattern.svg');
      background-size: 220px 220px;
      opacity: 0.42;
      mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.35) 46%, transparent 88%);
      -webkit-mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.35) 46%, transparent 88%);
    }

    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(30px);
      mix-blend-mode: screen;
      will-change: transform;
    }

    .glow--a {
      width: 920px;
      height: 920px;
      top: -520px;
      right: -180px;
      background: radial-gradient(circle, rgba(192, 255, 107, 0.24) 0%, rgba(192, 255, 107, 0.08) 38%, transparent 68%);
      animation: drift 26s ease-in-out infinite;
    }

    .glow--b {
      width: 760px;
      height: 760px;
      top: 32%;
      left: -470px;
      background: radial-gradient(circle, rgba(192, 255, 107, 0.14) 0%, rgba(192, 255, 107, 0.04) 42%, transparent 70%);
      animation: drift 32s ease-in-out infinite reverse;
    }

    .glow--c {
      width: 900px;
      height: 520px;
      bottom: -420px;
      left: 34%;
      background: radial-gradient(ellipse, rgba(192, 255, 107, 0.16) 0%, transparent 68%);
      animation: pulse 12s ease-in-out infinite;
    }

    .scanline {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 3px,
        rgba(255, 255, 255, 0.012) 3px,
        rgba(255, 255, 255, 0.012) 4px
      );
      opacity: 0.6;
    }

    .ocean-scrim {
      position: absolute;
      inset: 0;
      opacity: 0;
      background:
        linear-gradient(
          90deg,
          transparent 0%,
          rgba(0, 0, 0, 0.48) 9%,
          rgba(0, 0, 0, 0.56) 50%,
          rgba(0, 0, 0, 0.48) 91%,
          transparent 100%
        ),
        linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.35) 0%,
          rgba(0, 0, 0, 0.08) 16%,
          rgba(0, 0, 0, 0.16) 70%,
          rgba(0, 0, 0, 0.55) 100%
        );
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 18%,
        rgba(0, 0, 0, 0.7) 30%,
        #000 42%
      );
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 18%,
        rgba(0, 0, 0, 0.7) 30%,
        #000 42%
      );
    }

    .vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 85% 55% at 50% -5%, transparent 40%, rgba(0, 0, 0, 0.55) 100%),
        linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7) 100%);
    }

    :host-context(.has-ascii-ocean) .bg-grid,
    :host-context(.has-ascii-ocean) .bg-pixels {
      opacity: 0.08;
    }

    :host-context(.has-ascii-ocean) .glow {
      opacity: 0.22;
    }

    :host-context(.has-ascii-ocean) .scanline {
      opacity: 0.18;
    }

    :host-context(.has-ascii-ocean) .ocean-scrim {
      opacity: 1;
    }

    :host-context(.has-ascii-ocean) .vignette {
      opacity: 0.45;
    }

    @media (max-width: 720px) {
      .glow--a {
        width: 640px;
        height: 640px;
        top: -360px;
        right: -260px;
      }
      .bg-grid {
        background-size: 52px 52px;
      }
    }

    @keyframes drift {
      0%,
      100% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      50% {
        transform: translate3d(38px, -26px, 0) scale(1.08);
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 0.4;
      }
      50% {
        opacity: 0.8;
      }
    }
  `,
})
export class BackgroundComponent {}
