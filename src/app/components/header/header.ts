import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { QuoteService } from '../../core/quote.service';
import { NAV_LINKS, SITE } from '../../core/site-info';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;
  protected readonly links = NAV_LINKS;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly active = signal('inicio');
  protected readonly progress = signal(0);

  @HostListener('window:scroll')
  protected onScroll(): void {
    const top = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    this.scrolled.set(top > 16);
    this.progress.set(max > 0 ? Math.min(1, top / max) : 0);
    this.updateActive();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.syncScrollLock();
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.syncScrollLock();
  }

  protected openQuote(): void {
    this.closeMenu();
    this.quote.open();
  }

  private syncScrollLock(): void {
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  private updateActive(): void {
    const offset = window.scrollY + 150;
    let current = 'inicio';

    for (const link of this.links) {
      const element = document.getElementById(link.id);
      if (element && element.offsetTop <= offset) {
        current = link.id;
      }
    }

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 90) {
      current = this.links[this.links.length - 1].id;
    }

    this.active.set(current);
  }
}
