import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BackgroundComponent } from './components/background';
import { HeaderComponent } from './components/header/header';
import { HeroComponent } from './components/hero/hero';
import { HighlightsComponent } from './components/highlights';
import { ServicesComponent } from './components/services/services';
import { SolutionsComponent } from './components/solutions/solutions';
import { ProcessComponent } from './components/process/process';
import { TechnologiesComponent } from './components/technologies/technologies';
import { ProjectsComponent } from './components/projects/projects';
import { AboutComponent } from './components/about/about';
import { FaqComponent } from './components/faq/faq';
import { CtaComponent } from './components/cta/cta';
import { FooterComponent } from './components/footer/footer';
import { QuoteModalComponent } from './components/quote-modal/quote-modal';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackgroundComponent,
    HeaderComponent,
    HeroComponent,
    HighlightsComponent,
    ServicesComponent,
    SolutionsComponent,
    ProcessComponent,
    TechnologiesComponent,
    ProjectsComponent,
    AboutComponent,
    FaqComponent,
    CtaComponent,
    FooterComponent,
    QuoteModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
