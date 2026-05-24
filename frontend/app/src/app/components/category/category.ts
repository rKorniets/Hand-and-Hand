import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from './category.service';
import { Category, FilterConfig, FilterState } from './category.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit, OnChanges {
  @Input() config!: FilterConfig;
  @Output() filtersChanged = new EventEmitter<FilterState>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  cities: string[] = [];
  isLoading = false;

  readonly today: string = new Date().toISOString().split('T')[0];
  minDateTo: string = this.today;

  filters: FilterState = {
    search: '',
    categories: [],
    status: [],
    dateFrom: '',
    dateTo: '',
    city: '',
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    if (this.config.categoryContext) {
      this.isLoading = true;
      this.categoryService
        .getByContext(this.config.categoryContext)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.categories = data;
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.isLoading = false;
            this.cdr.markForCheck();
          },
        });
    }

    if (this.config.showCity) {
      this.categoryService
        .getCities()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((cities) => {
          this.cities = cities;
          this.cdr.markForCheck();
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      const prev = changes['config'].previousValue as FilterConfig;
      const curr = changes['config'].currentValue as FilterConfig;

      if (prev.categoryContext !== curr.categoryContext && curr.categoryContext) {
        this.isLoading = true;
        this.categoryService
          .getByContext(curr.categoryContext)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (data) => {
              this.categories = data;
              this.isLoading = false;
              this.cdr.markForCheck();
            },
            error: () => {
              this.isLoading = false;
              this.cdr.markForCheck();
            },
          });
      }
    }
  }

  toggleCategory(slug: string): void {
    this.toggleArrayValue(this.filters.categories, slug);
  }

  toggleStatus(value: string): void {
    this.toggleArrayValue(this.filters.status, value);
  }

  isChecked(arr: string[], value: string): boolean {
    return arr.includes(value);
  }

  onSearchChange(): void {
    this.emit();
  }

  onCityChange(): void {
    this.emit();
  }

  onDateChange(): void {
    this.minDateTo = this.filters.dateFrom || this.today;
    this.emit();
  }

  private emit(): void {
    this.filtersChanged.emit({ ...this.filters });
  }

  private toggleArrayValue(arr: string[], value: string): void {
    const idx = arr.indexOf(value);
    if (idx === -1) {
      arr.push(value);
    } else {
      arr.splice(idx, 1);
    }
    this.emit();
  }
}
