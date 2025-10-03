import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../shared/material/material.module';
import { SpendingService } from '../../services/spending.service';
import { Spending, SpendingCategory } from '../../models/spending.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spending-list',
  standalone: true,
  imports: [CommonModule, IonicModule, MaterialModule],
  template: `
    <div class="spending-list-container">
      <div class="header-section">
        <h2>Your Spendings</h2>
        <ion-button 
          expand="block" 
          color="primary" 
          (click)="addNewSpending()"
          class="add-button">
          <ion-icon name="add" slot="start"></ion-icon>
          Add New Spending
        </ion-button>
      </div>

      <div class="summary-cards" *ngIf="summary">
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Total Amount</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h3>€{{ summary.totalAmount | number:'1.2-2' }}</h3>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Total Entries</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h3>{{ summary.count }}</h3>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="filter-section">
        <mat-form-field appearance="outline">
          <mat-label>Filter by Category</mat-label>
          <mat-select [(value)]="selectedCategory" (selectionChange)="onCategoryFilter()">
            <mat-option [value]="null">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category">
              {{ getCategoryLabel(category) }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="spendings-list">
        <mat-card 
          *ngFor="let spending of filteredSpendings" 
          class="spending-item"
          (click)="viewSpending(spending)">
          <mat-card-header>
            <mat-card-title>{{ spending.description }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip-set>
                <mat-chip>{{ getCategoryLabel(spending.category) }}</mat-chip>
                <mat-chip *ngIf="spending.isRecurring" color="accent">
                  Recurring
                </mat-chip>
              </mat-chip-set>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="spending-details">
              <div class="amount">€{{ spending.amount | number:'1.2-2' }}</div>
              <div class="date">{{ spending.date | date:'short' }}</div>
            </div>
            <div class="notes" *ngIf="spending.notes">
              {{ spending.notes }}
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-icon-button (click)="editSpending(spending); $event.stopPropagation()">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteSpending(spending); $event.stopPropagation()">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="filteredSpendings.length === 0">
        <mat-icon class="empty-icon">receipt_long</mat-icon>
        <h3>No spendings found</h3>
        <p>Start tracking your expenses by adding your first spending entry.</p>
      </div>
    </div>
  `,
  styles: [`
    .spending-list-container {
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .header-section h2 {
      margin-bottom: 16px;
      color: var(--ion-color-primary);
    }

    .add-button {
      margin: 16px 0;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      text-align: center;
    }

    .summary-card h3 {
      margin: 8px 0;
      font-size: 1.5em;
      color: var(--ion-color-primary);
    }

    .filter-section {
      margin-bottom: 24px;
    }

    .filter-section mat-form-field {
      width: 100%;
      max-width: 300px;
    }

    .spendings-list {
      display: grid;
      gap: 16px;
    }

    .spending-item {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }

    .spending-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .spending-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
    }

    .amount {
      font-size: 1.2em;
      font-weight: bold;
      color: var(--ion-color-primary);
    }

    .date {
      color: var(--ion-color-medium);
      font-size: 0.9em;
    }

    .notes {
      margin-top: 8px;
      font-style: italic;
      color: var(--ion-color-medium);
    }

    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: var(--ion-color-medium);
    }

    .empty-icon {
      font-size: 4em;
      margin-bottom: 16px;
    }

    mat-chip-set {
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      .spending-details {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .summary-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SpendingListComponent implements OnInit, OnDestroy {
  spendings: Spending[] = [];
  filteredSpendings: Spending[] = [];
  selectedCategory: SpendingCategory | null = null;
  summary: any = null;
  categories = Object.values(SpendingCategory);
  
  private subscription = new Subscription();

  constructor(
    private spendingService: SpendingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.spendingService.spendings$.subscribe(spendings => {
        this.spendings = spendings;
        this.applyFilter();
      })
    );
    
    this.loadSummary();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async loadSummary() {
    this.summary = await this.spendingService.getSpendingSummary();
  }

  onCategoryFilter() {
    this.applyFilter();
  }

  private applyFilter() {
    if (this.selectedCategory) {
      this.filteredSpendings = this.spendings.filter(
        spending => spending.category === this.selectedCategory
      );
    } else {
      this.filteredSpendings = [...this.spendings];
    }
  }

  getCategoryLabel(category: SpendingCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  }

  addNewSpending() {
    this.router.navigate(['/tabs/spending-form']);
  }

  viewSpending(spending: Spending) {
    this.router.navigate(['/tabs/spending-detail', spending.id]);
  }

  editSpending(spending: Spending) {
    this.router.navigate(['/tabs/spending-form', spending.id]);
  }

  async deleteSpending(spending: Spending) {
    if (spending.id && confirm(`Are you sure you want to delete "${spending.description}"?`)) {
      try {
        await this.spendingService.deleteSpending(spending.id);
        await this.loadSummary();
      } catch (error) {
        console.error('Error deleting spending:', error);
        // You could add a toast notification here
      }
    }
  }
}