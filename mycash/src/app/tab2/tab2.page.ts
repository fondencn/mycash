import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon
} from '@ionic/angular/standalone';
import { SpendingService } from '../services/spending.service';
import { SpendingSummary, SpendingCategory } from '../models/spending.model';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { barChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon
  ]
})
export class Tab2Page implements OnInit, OnDestroy {
  summary: SpendingSummary | null = null;
  private subscription = new Subscription();

  constructor(private spendingService: SpendingService) {
    addIcons({ barChartOutline });
  }

  ngOnInit() {
    this.loadAnalytics();
    
    // Update analytics when spendings change
    this.subscription.add(
      this.spendingService.spendings$.subscribe(() => {
        this.loadAnalytics();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async loadAnalytics() {
    try {
      this.summary = await this.spendingService.getSpendingSummary();
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  getCategoryBreakdown() {
    if (!this.summary || !this.summary.categoryBreakdown) {
      return [];
    }

    const breakdown = Object.entries(this.summary.categoryBreakdown).map(([category, amount]) => {
      const percentage = this.summary!.totalAmount > 0 
        ? Math.round((amount / this.summary!.totalAmount) * 100) 
        : 0;
      
      return {
        name: this.getCategoryLabel(category as SpendingCategory),
        amount,
        percentage
      };
    });

    return breakdown.sort((a, b) => b.amount - a.amount);
  }

  private getCategoryLabel(category: SpendingCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  }
}
