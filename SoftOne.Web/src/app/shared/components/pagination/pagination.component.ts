import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import {
  PAGE_SIZE_OPTIONS,
  PageSizeOption,
} from '../../../core/models/task-query.model';
import {
  formatPageIndicator,
  formatPaginationRange,
} from '../../utils/pagination.ui';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalCount = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly disabled = input(false);
  readonly pageSizeOptions = input<readonly number[]>(PAGE_SIZE_OPTIONS);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly rangeLabel = computed(() =>
    formatPaginationRange(
      this.currentPage(),
      this.pageSize(),
      this.totalCount()
    )
  );

  readonly pageIndicator = computed(() =>
    formatPageIndicator(this.currentPage(), this.totalPages())
  );

  readonly canGoPrevious = computed(() => this.currentPage() > 1);
  readonly canGoNext = computed(
    () => this.totalPages() > 0 && this.currentPage() < this.totalPages()
  );

  readonly showNavigation = computed(() => this.totalCount() > 0);

  onPrevious(): void {
    if (!this.canGoPrevious() || this.disabled()) {
      return;
    }

    this.pageChange.emit(this.currentPage() - 1);
  }

  onNext(): void {
    if (!this.canGoNext() || this.disabled()) {
      return;
    }

    this.pageChange.emit(this.currentPage() + 1);
  }

  onPageSizeChange(value: PageSizeOption): void {
    if (this.disabled() || value === this.pageSize()) {
      return;
    }

    this.pageSizeChange.emit(value);
  }
}
