import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly openState = signal(false);
  readonly isOpen = this.openState.asReadonly();

  open(): void {
    this.openState.set(true);
  }

  close(): void {
    this.openState.set(false);
  }
}
