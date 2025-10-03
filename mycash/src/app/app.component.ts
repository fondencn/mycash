import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    // Database service will automatically initialize when injected
    this.databaseService.getDatabaseState().subscribe(isReady => {
      if (isReady) {
        console.log('Database is ready for MyCash app');
      }
    });
  }
}
