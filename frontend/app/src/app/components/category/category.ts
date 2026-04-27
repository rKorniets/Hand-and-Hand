import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
})
export class FiltersComponent implements OnInit {
  @Input() config!: FilterConfig;
  @Output() filtersChanged = new EventEmitter<FilterState>();

  private readonly destroyRef = inject(DestroyRef);

  categories: Category[] = [];
  cities: string[] = [];
  isLoading = false;

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
          },
          error: () => (this.isLoading = false),
        });
    }

    if (this.config.showCity) {
      this.categoryService
        .getCities()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((cities) => {
          this.cities = cities;
        });
    }
  }

  toggleCategory(slug: string): void {
    this.toggleArrayValue(this.filters.categories, slug);
  }

  toggleStatus(value: string): void {
    this.toggleArrayValue(this.filters.status, value);
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  get minDateTo(): string {
    return this.filters.dateFrom || this.today;
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
