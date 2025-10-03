import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../shared/material/material.module';
import { SpendingService } from '../../services/spending.service';
import { Spending, SpendingCategory } from '../../models/spending.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spending-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, MaterialModule],
  template: `
    <div class="detail-container" *ngIf="spending">
      <div class="header-section">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Spending Details</h2>
        <div class="action-buttons">
          <button mat-icon-button (click)="editSpending()">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteSpending()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <mat-card class="detail-card">
        <mat-card-header>
          <mat-card-title>{{ spending.description }}</mat-card-title>
          <mat-card-subtitle>
            <mat-chip-set>
              <mat-chip>{{ getCategoryLabel(spending.category) }}</mat-chip>
              <mat-chip *ngIf="spending.isRecurring" color="accent">
                Recurring {{ getRecurringLabel() }}
              </mat-chip>
            </mat-chip-set>
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="detail-section">
            <div class="detail-item">
              <div class="detail-label">
                <mat-icon>euro</mat-icon>
                Amount
              </div>
              <div class="detail-value amount">€{{ spending.amount | number:'1.2-2' }}</div>
            </div>

            <mat-divider></mat-divider>

            <div class="detail-item">
              <div class="detail-label">
                <mat-icon>event</mat-icon>
                Date
              </div>
              <div class="detail-value">{{ spending.date | date:'fullDate' }}</div>
            </div>

            <mat-divider></mat-divider>

            <div class="detail-item">
              <div class="detail-label">
                <mat-icon>category</mat-icon>
                Category
              </div>
              <div class="detail-value">{{ getCategoryLabel(spending.category) }}</div>
            </div>

            <mat-divider *ngIf="spending.notes"></mat-divider>

            <div class="detail-item" *ngIf="spending.notes">
              <div class="detail-label">
                <mat-icon>notes</mat-icon>
                Notes
              </div>
              <div class="detail-value notes">{{ spending.notes }}</div>
            </div>

            <mat-divider></mat-divider>

            <div class="detail-item">
              <div class="detail-label">
                <mat-icon>schedule</mat-icon>
                Created
              </div>
              <div class="detail-value">{{ spending.createdAt | date:'medium' }}</div>
            </div>

            <div class="detail-item" *ngIf="spending.updatedAt && spending.updatedAt.getTime() !== spending.createdAt.getTime()">
              <div class="detail-label">
                <mat-icon>update</mat-icon>
                Last Updated
              </div>
              <div class="detail-value">{{ spending.updatedAt | date:'medium' }}</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="action-section">
        <button mat-button color="primary" (click)="editSpending()" class="action-button">
          <mat-icon>edit</mat-icon>
          Edit Spending
        </button>
        <button mat-button color="warn" (click)="deleteSpending()" class="action-button">
          <mat-icon>delete</mat-icon>
          Delete Spending
        </button>
      </div>
    </div>

    <div class="not-found" *ngIf="!spending && !loading">
      <mat-icon class="not-found-icon">error_outline</mat-icon>
      <h3>Spending not found</h3>
      <p>The spending entry you're looking for doesn't exist or has been deleted.</p>
      <button mat-raised-button color="primary" (click)="goBack()">
        Go Back
      </button>
    </div>

    <div class="loading" *ngIf="loading">
      <mat-spinner></mat-spinner>
      <p>Loading spending details...</p>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
    }

    .header-section h2 {
      flex: 1;
      text-align: center;
      margin: 0;
      color: var(--ion-color-primary);
    }

    .back-button {
      flex-shrink: 0;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .detail-card {
      margin-bottom: 24px;
    }

    .detail-section {
      padding: 8px 0;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 0;
      gap: 16px;
    }

    .detail-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: var(--ion-color-medium);
      min-width: 120px;
    }

    .detail-value {
      flex: 1;
      text-align: right;
      word-break: break-word;
    }

    .detail-value.amount {
      font-size: 1.2em;
      font-weight: bold;
      color: var(--ion-color-primary);
    }

    .detail-value.notes {
      text-align: left;
      font-style: italic;
      color: var(--ion-color-dark);
    }

    .action-section {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .action-button {
      flex: 1;
      max-width: 200px;
    }

    .not-found,
    .loading {
      text-align: center;
      padding: 48px 16px;
      color: var(--ion-color-medium);
    }

    .not-found-icon {
      font-size: 4em;
      margin-bottom: 16px;
    }

    .loading mat-spinner {
      margin: 0 auto 16px;
    }

    mat-chip-set {
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      .header-section h2 {
        font-size: 1.2em;
      }

      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .detail-label {
        min-width: auto;
      }

      .detail-value {
        text-align: left;
      }

      .detail-value.amount {
        font-size: 1.4em;
      }

      .action-section {
        flex-direction: column;
      }

      .action-button {
        max-width: none;
      }
    }
  `]
})
export class SpendingDetailComponent implements OnInit {
  spending: Spending | null = null;
  loading = true;
  spendingId: number | null = null;

  constructor(
    private spendingService: SpendingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.spendingId = parseInt(id, 10);
      this.loadSpending();
    } else {
      this.loading = false;
    }
  }

  loadSpending() {
    if (!this.spendingId) {
      this.loading = false;
      return;
    }

    const spendings = this.spendingService.getCurrentSpendings();
    this.spending = spendings.find(s => s.id === this.spendingId) || null;
    this.loading = false;
  }

  getCategoryLabel(category: SpendingCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  }

  getRecurringLabel(): string {
    if (!this.spending?.recurringType) return '';
    return this.spending.recurringType.charAt(0).toUpperCase() + 
           this.spending.recurringType.slice(1);
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  editSpending() {
    if (this.spending?.id) {
      this.router.navigate(['/tabs/spending-form', this.spending.id]);
    }
  }

  async deleteSpending() {
    if (!this.spending?.id) return;

    if (confirm(`Are you sure you want to delete "${this.spending.description}"?`)) {
      try {
        await this.spendingService.deleteSpending(this.spending.id);
        this.router.navigate(['/tabs/tab1']);
      } catch (error) {
        console.error('Error deleting spending:', error);
        // You could show an error toast here
      }
    }
  }
}