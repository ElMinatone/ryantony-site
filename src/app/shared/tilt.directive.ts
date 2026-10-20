import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appTilt]',
})
export class TiltDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private enabled = false;

  @Input() appTilt: string | number = 7;

  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    this.enabled =
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!this.enabled) {
      return;
    }

    host.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    host.addEventListener('pointermove', this.onMove);
    host.addEventListener('pointerleave', this.onLeave);
  }

  ngOnDestroy(): void {
    const host = this.element.nativeElement;
    host.removeEventListener('pointermove', this.onMove);
    host.removeEventListener('pointerleave', this.onLeave);
  }

  private readonly onMove = (event: PointerEvent): void => {
    if (!this.enabled) {
      return;
    }
    const host = this.element.nativeElement;
    const rect = host.getBoundingClientRect();
    const max = Number(this.appTilt) || 7;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    host.style.transition = 'transform 0.12s linear';
    host.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };

  private readonly onLeave = (): void => {
    const host = this.element.nativeElement;
    host.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    host.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
  };
}
