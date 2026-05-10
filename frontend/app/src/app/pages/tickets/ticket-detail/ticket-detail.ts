import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { TicketService } from '../ticket.service';
import { OrganizationProfileService } from '../../profile-organization/profile-organization.service';
import {
  TicketItem,
  TicketStatus,
  TicketPriority,
  TaskDifficulty,
  TicketTask,
} from '../ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket: TicketItem | null = null;
  loading = true;
  accepting = false;
  showAcceptForm = false;
  successMessage = '';
  errorMessage = '';
  currentOrgProfileId: number | null = null;
  projectId: number | null = null;
  loadingProject = false;
  acceptedTask: TicketTask | null = null;
  acceptForm: FormGroup;

  readonly difficulties: Array<{ value: TaskDifficulty; label: string }> = [
    { value: 'EASY', label: 'Легка' },
    { value: 'MEDIUM', label: 'Середня' },
    { value: 'HARD', label: 'Складна' },
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private orgService: OrganizationProfileService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.acceptForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      difficulty: ['MEDIUM' as TaskDifficulty, Validators.required],
      points_reward_base: [50, [Validators.required, Validators.min(0), Validators.max(10000)]],
      deadline: [''],
    });
  }

  ngOnInit(): void {
    this.currentOrgProfileId = this.getOrgProfileId();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ticketService
      .getTicketById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ticket) => {
          this.ticket = ticket;
          this.acceptedTask = this.resolveAcceptedTask(ticket);
          this.acceptForm.patchValue({ title: ticket.title, description: ticket.description });
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getOrgProfileId(): number | null {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return typeof payload?.organization_profile_id === 'number'
        ? payload.organization_profile_id
        : null;
    } catch (e) {
      console.warn('Failed to parse JWT token', e);
      return null;
    }
  }

  private resolveAcceptedTask(ticket: TicketItem): TicketTask | null {
    if (!ticket?.task?.length || !this.currentOrgProfileId) return null;
    return (
      ticket.task.find((t) => t.project?.organization_profile_id === this.currentOrgProfileId) ??
      null
    );
  }

  canAccept(): boolean {
    if (!this.ticket?.task?.length) return true;
    return !this.ticket.task.some(
      (t) => t.project?.organization_profile_id === this.currentOrgProfileId,
    );
  }

  close(): void {
    this.router.navigate(['/tickets']);
  }

  openAcceptForm(): void {
    this.showAcceptForm = true;
    this.loadProjectId();
  }

  private loadProjectId(): void {
    if (this.projectId) return;

    this.loadingProject = true;
    this.cdr.markForCheck();

    this.orgService
      .getOrganization()
      .pipe(
        switchMap((org) => this.orgService.getOrgActivities(org.id, 1)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (projects) => {
          if (projects.length > 0) {
            this.projectId = projects[0].id;
          } else {
            this.errorMessage =
              'У вашої організації немає жодного проєкту. Спочатку створіть проєкт.';
          }
          this.loadingProject = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Не вдалось завантажити проєкти організації.';
          this.loadingProject = false;
          this.cdr.markForCheck();
        },
      });
  }

  closeAcceptForm(): void {
    this.showAcceptForm = false;
    this.errorMessage = '';
    this.acceptForm.reset({ difficulty: 'MEDIUM', points_reward_base: 50 });
    if (this.ticket) {
      this.acceptForm.patchValue({
        title: this.ticket.title,
        description: this.ticket.description,
      });
    }
  }

  submitAccept(): void {
    if (this.acceptForm.invalid || !this.ticket || !this.projectId) return;

    const ticketId = this.ticket.id;
    const val = this.acceptForm.value;
    this.accepting = true;
    this.errorMessage = '';

    this.ticketService
      .acceptTicketAsTask({
        project_id: this.projectId,
        ticket_id: ticketId,
        title: val.title,
        description: val.description,
        difficulty: val.difficulty,
        points_reward_base: val.points_reward_base,
        location_id: this.ticket.location_id ?? undefined,
        deadline: val.deadline || undefined,
      })
      .pipe(
        switchMap(() => this.ticketService.getTicketById(ticketId)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (fresh) => {
          this.accepting = false;
          this.showAcceptForm = false;
          this.successMessage = 'Тікет успішно прийнято як задачу!';
          this.ticket = fresh;
          this.acceptedTask = this.resolveAcceptedTask(fresh);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.accepting = false;
          this.errorMessage = err?.error?.message ?? 'Помилка при прийнятті тікета';
          this.cdr.markForCheck();
        },
      });
  }

  navigateToCreateFundraiser(task: TicketTask): void {
    this.router.navigate(['/fundraisingCampaign/create'], {
      queryParams: { task_id: task.id, title: task.title },
    });
  }

  navigateToCreateEvent(task: TicketTask): void {
    this.router.navigate(['/activity/create'], {
      queryParams: { task_id: task.id, title: task.title },
    });
  }

  getStatusLabel(status: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
      OPEN: 'Відкритий',
      IN_REVIEW: 'На розгляді',
      RESOLVED: 'Вирішено',
      CLOSED: 'Закрито',
      CANCELLED: 'Скасовано',
    };
    return map[status] ?? status;
  }

  getPriorityLabel(priority: TicketPriority): string {
    const map: Record<TicketPriority, string> = {
      LOW: 'Низький',
      MEDIUM: 'Середній',
      HIGH: 'Високий',
      URGENT: 'Терміново',
    };
    return map[priority] ?? priority;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
