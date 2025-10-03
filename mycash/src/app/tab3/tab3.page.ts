import { Component } from '@angular/core';
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
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { SpendingService } from '../services/spending.service';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import { download, trash, mail } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
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
    IonIcon,
    IonButton
  ],
})
export class Tab3Page {
  platform = Capacitor.getPlatform();

  constructor(private spendingService: SpendingService) {
    addIcons({ download, trash, mail });
  }

  async exportData() {
    try {
      const spendings = this.spendingService.getCurrentSpendings();
      if (spendings.length === 0) {
        alert('No data to export');
        return;
      }

      // Create CSV content
      const headers = ['Description', 'Amount', 'Category', 'Date', 'Recurring', 'Notes', 'Created'];
      const csvContent = [
        headers.join(','),
        ...spendings.map(spending => [
          `"${spending.description}"`,
          spending.amount,
          spending.category,
          spending.date.toISOString(),
          spending.isRecurring ? 'Yes' : 'No',
          `"${spending.notes || ''}"`,
          spending.createdAt.toISOString()
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mycash-spendings-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  }

  async clearAllData() {
    const confirmed = confirm(
      'Are you sure you want to delete ALL spending data? This action cannot be undone.'
    );
    
    if (confirmed) {
      const doubleConfirmed = confirm(
        'This will permanently delete all your spending records. Are you absolutely sure?'
      );
      
      if (doubleConfirmed) {
        try {
          const spendings = this.spendingService.getCurrentSpendings();
          for (const spending of spendings) {
            if (spending.id) {
              await this.spendingService.deleteSpending(spending.id);
            }
          }
          alert('All data has been cleared successfully.');
        } catch (error) {
          console.error('Error clearing data:', error);
          alert('Error clearing data. Please try again.');
        }
      }
    }
  }

  openSupport() {
    const subject = encodeURIComponent('MyCash Support Request');
    const body = encodeURIComponent('Hi,\n\nI need help with MyCash app.\n\nDetails:\n\n');
    const mailto = `mailto:support@mycash.app?subject=${subject}&body=${body}`;
    
    window.open(mailto, '_system');
  }
}
