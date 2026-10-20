import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { QuoteService } from '../../core/quote.service';
import { SITE } from '../../core/site-info';

type CopyState = 'idle' | 'copied' | 'error';

@Component({
  selector: 'app-quote-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './quote-modal.html',
  styleUrl: './quote-modal.scss',
})
export class QuoteModalComponent implements OnDestroy {
  private readonly quote = inject(QuoteService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly callButton = viewChild<ElementRef<HTMLAnchorElement>>('callButton');

  protected readonly site = SITE;
  protected readonly copyState = signal<CopyState>('idle');
  private copyTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const open = this.quote.isOpen();
      const dialog = this.dialog().nativeElement;

      if (open) {
        if (!dialog.open) {
          dialog.showModal();
        }
        document.body.classList.add('has-modal');
        requestAnimationFrame(() => this.callButton()?.nativeElement.focus());
      } else {
        if (dialog.open) {
          dialog.close();
        }
        document.body.classList.remove('has-modal');
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.copyTimer);
    document.body.classList.remove('has-modal');
  }

  protected close(): void {
    this.quote.close();
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  protected onDialogClose(): void {
    this.quote.close();
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  protected async copyNumber(): Promise<void> {
    const value = this.site.phoneDisplay;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        this.fallbackCopy(value);
      }
      this.copyState.set('copied');
    } catch {
      this.copyState.set('error');
    }

    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.copyState.set('idle'), 2800);
  }

  private fallbackCopy(value: string): void {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    document.body.removeChild(field);
  }
}
