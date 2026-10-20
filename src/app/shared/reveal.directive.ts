import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

type RevealKind = 'up' | 'left' | 'right' | 'scale' | 'fade';

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  @Input() appReveal: string | number = '';
  @Input() appRevealKind: RevealKind = 'up';

  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    const delay = Number(this.appReveal) || 0;

    host.dataset['reveal'] = this.appRevealKind;

    if (delay > 0) {
      host.style.transitionDelay = `${delay}ms`;
    }

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      host.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            host.classList.add('is-visible');
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.01 },
    );

    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
