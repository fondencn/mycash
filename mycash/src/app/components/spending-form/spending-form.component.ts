import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../shared/material/material.module';
import { SpendingService } from '../../services/spending.service';
import { Spending, SpendingCategory, RecurringType } from '../../models/spending.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spending-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, MaterialModule],
  template: `
    <div class="form-container">
      <div class="header-section">
        <h2>{{ isEditing ? 'Edit Spending' : 'Add New Spending' }}</h2>
      </div>

      <form [formGroup]="spendingForm" (ngSubmit)="onSubmit()" class="spending-form">
        <mat-card>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description *</mat-label>
                <input matInput formControlName="description" placeholder="Enter spending description">
                <mat-error *ngIf="spendingForm.get('description')?.hasError('required')">
                  Description is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Amount *</mat-label>
                <input matInput type="number" step="0.01" formControlName="amount" placeholder="0.00">
                <span matTextPrefix>€&nbsp;</span>
                <mat-error *ngIf="spendingForm.get('amount')?.hasError('required')">
                  Amount is required
                </mat-error>
                <mat-error *ngIf="spendingForm.get('amount')?.hasError('min')">
                  Amount must be greater than 0
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category *</mat-label>
                <mat-select formControlName="category">
                  <mat-option *ngFor="let category of categories" [value]="category">
                    {{ getCategoryLabel(category) }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="spendingForm.get('category')?.hasError('required')">
                  Category is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date *</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date">
                <mat-hint>MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="spendingForm.get('date')?.hasError('required')">
                  Date is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-checkbox formControlName="isRecurring">
                This is a recurring spending
              </mat-checkbox>
            </div>

            <div class="form-row" *ngIf="spendingForm.get('isRecurring')?.value">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Recurring Type</mat-label>
                <mat-select formControlName="recurringType">
                  <mat-option *ngFor="let type of recurringTypes" [value]="type">
                    {{ getRecurringTypeLabel(type) }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes (Optional)</mat-label>
                <textarea matInput formControlName="notes" rows="3" placeholder="Additional notes..."></textarea>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="form-actions">
          <button mat-button type="button" (click)="cancel()" class="cancel-button">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="spendingForm.invalid || isSubmitting">
            <mat-icon *ngIf="isSubmitting">hourglass_empty</mat-icon>
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Save') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .header-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .header-section h2 {
      color: var(--ion-color-primary);
      margin-bottom: 8px;
    }

    .spending-form {
      width: 100%;
    }

    .form-row {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      gap: 16px;
    }

    .cancel-button {
      flex: 1;
    }

    button[mat-raised-button] {
      flex: 2;
    }

    mat-card {
      margin-bottom: 16px;
    }

    mat-checkbox {
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 8px;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .cancel-button,
      button[mat-raised-button] {
        flex: none;
        width: 100%;
      }
    }
  `]
})
export class SpendingFormComponent implements OnInit {
  spendingForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  spendingId: number | null = null;
  
  categories = Object.values(SpendingCategory);
  recurringTypes = Object.values(RecurringType);

  constructor(
    private fb: FormBuilder,
    private spendingService: SpendingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.spendingForm = this.createForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.spendingId = parseInt(id, 10);
      this.isEditing = true;
      this.loadSpending();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [new Date(), Validators.required],
      isRecurring: [false],
      recurringType: [null],
      notes: ['', Validators.maxLength(500)]
    });
  }

  async loadSpending() {
    if (!this.spendingId) return;
    
    const spendings = this.spendingService.getCurrentSpendings();
    const spending = spendings.find(s => s.id === this.spendingId);
    
    if (spending) {
      this.spendingForm.patchValue({
        description: spending.description,
        amount: spending.amount,
        category: spending.category,
        date: spending.date,
        isRecurring: spending.isRecurring,
        recurringType: spending.recurringType,
        notes: spending.notes
      });
    }
  }

  getCategoryLabel(category: SpendingCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  }

  getRecurringTypeLabel(type: RecurringType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  async onSubmit() {
    if (this.spendingForm.invalid) return;

    this.isSubmitting = true;
    
    try {
      const formValue = this.spendingForm.value;
      
      if (this.isEditing && this.spendingId) {
        const spending: Spending = {
          id: this.spendingId,
          description: formValue.description,
          amount: formValue.amount,
          category: formValue.category,
          date: new Date(formValue.date),
          isRecurring: formValue.isRecurring,
          recurringType: formValue.isRecurring ? formValue.recurringType : null,
          notes: formValue.notes,
          createdAt: new Date(), // This will be preserved by the service
          updatedAt: new Date()
        };
        
        await this.spendingService.updateSpending(spending);
      } else {
        const spending = {
          description: formValue.description,
          amount: formValue.amount,
          category: formValue.category,
          date: new Date(formValue.date),
          isRecurring: formValue.isRecurring,
          recurringType: formValue.isRecurring ? formValue.recurringType : null,
          notes: formValue.notes
        };
        
        await this.spendingService.addSpending(spending);
      }

      this.router.navigate(['/tabs/tab1']);
    } catch (error) {
      console.error('Error saving spending:', error);
      // You could show an error toast here
    } finally {
      this.isSubmitting = false;
    }
  }

  cancel() {
    this.router.navigate(['/tabs/tab1']);
  }
}