import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private readonly zone = inject(NgZone);

  private lenis?: Lenis;
  private rafId = 0;
  private lockObserver?: MutationObserver;
  private initialized = false;

  init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    this.initialized = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.2,
        autoRaf: false,
      });

      this.lenis = lenis;

      const raf = (time: number): void => {
        lenis.raf(time);
        this.rafId = requestAnimationFrame(raf);
      };

      this.rafId = requestAnimationFrame(raf);

      document.addEventListener('click', this.onDocumentClick);
      this.observeScrollLock();
    });
  }

  scrollTo(target: string | number | Element, offset = -88): void {
    if (this.lenis) {
      this.lenis.start();
      this.lenis.scrollTo(target, { offset, duration: 1.2 });
      return;
    }

    const element =
      typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;

    if (typeof element === 'number') {
      window.scrollTo({ top: element, behavior: 'auto' });
      return;
    }

    if (element instanceof Element) {
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'auto' });
    }
  }

  toTop(): void {
    this.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick);
    this.lockObserver?.disconnect();

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.lenis?.destroy();
    this.lenis = undefined;
  }

  private readonly onDocumentClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target;
    const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href^="#"]') : null;

    if (!anchor) {
      return;
    }

    const hash = anchor.getAttribute('href');

    if (!hash || hash === '#') {
      return;
    }

    const section = document.getElementById(hash.slice(1));

    if (!section) {
      return;
    }

    event.preventDefault();
    this.scrollTo(section);
    history.pushState(null, '', hash);
  };

  private observeScrollLock(): void {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.lockObserver = new MutationObserver(() => this.syncScrollLock());
    this.lockObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    this.syncScrollLock();
  }

  private syncScrollLock(): void {
    if (!this.lenis) {
      return;
    }

    const locked =
      document.body.classList.contains('has-modal') || document.body.style.overflow === 'hidden';

    if (locked) {
      this.lenis.stop();
    } else {
      this.lenis.start();
    }
  }
}
