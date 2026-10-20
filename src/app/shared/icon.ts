import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name()) {
        @case ('arrow-right') {
          <path d="M4 12h16" />
          <path d="m14 6 6 6-6 6" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        }
        @case ('arrow-up') {
          <path d="M12 20V4" />
          <path d="m6 10 6-6 6 6" />
        }
        @case ('check') {
          <path d="m4 12.5 5 5L20 6.5" />
        }
        @case ('check-circle') {
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.2 2.7 2.8L16.5 9" />
        }
        @case ('code') {
          <path d="m8 7-5 5 5 5" />
          <path d="m16 7 5 5-5 5" />
          <path d="m13.5 5-3 14" />
        }
        @case ('terminal') {
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="m7 9 3 3-3 3" />
          <path d="M13 15h4" />
        }
        @case ('browser') {
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 9h18" />
          <circle cx="6.5" cy="6.5" r=".6" fill="currentColor" />
          <circle cx="9" cy="6.5" r=".6" fill="currentColor" />
        }
        @case ('layers') {
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12.5 9 5 9-5" />
          <path d="m3 17 9 5 9-5" />
        }
        @case ('api') {
          <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
          <path d="M4.5 5.5v6c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-6" />
          <path d="M4.5 11.5v6c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-6" />
        }
        @case ('automation') {
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        }
        @case ('cart') {
          <path d="M3 4h2.2l2.2 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.95-1.55L20.5 8H6" />
          <circle cx="9.5" cy="20" r="1" />
          <circle cx="17.5" cy="20" r="1" />
        }
        @case ('shield') {
          <path d="M12 3 5 6v5.5c0 4.4 2.9 7.9 7 9.5 4.1-1.6 7-5.1 7-9.5V6l-7-3Z" />
          <path d="m9 12 2 2 4-4.5" />
        }
        @case ('phone') {
          <path d="M6.2 3.5h3l1.5 4-2 1.4a13.5 13.5 0 0 0 6.4 6.4l1.4-2 4 1.5v3a2.5 2.5 0 0 1-2.7 2.5C10.3 19.4 4.6 13.7 3.7 6.2A2.5 2.5 0 0 1 6.2 3.5Z" />
        }
        @case ('close') {
          <path d="m6 6 12 12M18 6 6 18" />
        }
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('copy') {
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M15 5.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5" />
        }
        @case ('mail') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5.2l3.4 2" />
        }
        @case ('pin') {
          <path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.6" />
        }
        @case ('spark') {
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="m6.3 6.3 2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        }
        @case ('target') {
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        }
        @case ('users') {
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 20a6 6 0 0 0-2-4.5" />
        }
        @case ('chart') {
          <path d="M4 20V4M4 20h16" />
          <path d="M8 16v-4M12 16V8M16 16V5M20 16v-7" />
        }
        @case ('cloud') {
          <path d="M7 18a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 9.5a4.3 4.3 0 0 1-.5 8.5H7Z" />
        }
        @case ('rocket') {
          <path d="M12 15c-1.8-.6-3.4-2.2-4-4 1.4-3.7 4.6-6.4 9-7-.5 4.5-3.3 7.7-7 9.1" />
          <path d="M9 15c-1.2.4-2.3 1.5-3 3.5 2-.7 3.1-1.8 3.5-3" />
          <path d="M14.5 9.5h.01" />
          <path d="M7.5 16.5c-1 1-1.5 2.5-1.5 4 1.5 0 3-.5 4-1.5" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        }
        @case ('pen') {
          <path d="m3 21 4-1 11.5-11.5a2.1 2.1 0 0 0-3-3L4 17l-1 4Z" />
          <path d="m14.5 6.5 3 3" />
        }
        @case ('bolt') {
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
        }
        @case ('lock') {
          <rect x="4" y="10" width="16" height="11" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M12 14v3" />
        }
        @case ('refresh') {
          <path d="M20 7v5h-5" />
          <path d="M4 17v-5h5" />
          <path d="M6.1 8a7 7 0 0 1 11.4-1L20 10M4 14l2.5 3A7 7 0 0 0 18 16" />
        }
        @case ('message') {
          <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
          <path d="M8 11h8M8 14h5" />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        }
        @case ('database') {
          <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
          <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
          <path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
        }
        @case ('cpu') {
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9.5" y="9.5" width="5" height="5" rx=".8" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        }
        @case ('globe') {
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" />
        }
        @case ('figma') {
          <path d="M8.5 3H12v6H8.5a3 3 0 0 1 0-6ZM12 3h3.5a3 3 0 0 1 0 6H12V3ZM12 9h3.5a3 3 0 1 1-3.5 3V9ZM8.5 9H12v6H8.5a3 3 0 0 1 0-6ZM8.5 15H12v3.5a3 3 0 1 1-3.5-3.5Z" />
        }
        @default {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l2.5 2" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      line-height: 0;
    }
  `,
})
export class IconComponent {
  readonly name = input('spark');
  readonly size = input(20);
}
