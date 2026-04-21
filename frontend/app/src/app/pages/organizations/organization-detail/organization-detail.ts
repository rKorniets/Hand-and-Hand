import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrganizationService } from '../organization.service';
import { Organization } from '../organizations.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './organization-detail.html',
  styleUrl: './organization-detail.scss',
})
export class OrganizationDetailComponent implements OnInit {
  org: Organization | null = null;
  loading = true;
  error = false;
  showFullDesc = false;

  constructor(
    private route: ActivatedRoute,
    private orgService: OrganizationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.orgService.getOrganizationById(id).subscribe({
        next: (data) => {
          this.org = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Помилка завантаження:', err);
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  toggleDesc(): void {
    this.showFullDesc = !this.showFullDesc;
  }
}
