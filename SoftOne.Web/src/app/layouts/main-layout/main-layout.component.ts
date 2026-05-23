import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppToolbarComponent } from '../app-toolbar/app-toolbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, AppToolbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
