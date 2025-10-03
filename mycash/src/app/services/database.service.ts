import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private isDbReady = new BehaviorSubject<boolean>(false);
  private database!: SQLiteDBConnection;
  private readonly DB_NAME = 'mycash.db';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        // For native platforms
        await this.sqlite.checkConnectionsConsistency();
        await this.sqlite.isConnection(this.DB_NAME, false);
      }

      this.database = await this.sqlite.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        this.DB_VERSION,
        false
      );

      await this.database.open();
      await this.createTables();
      this.isDbReady.next(true);
    } catch (error) {
      console.error('Error initializing database:', error);
      this.isDbReady.next(false);
    }
  }

  private async createTables() {
    const createSpendingTable = `
      CREATE TABLE IF NOT EXISTS spending (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        isRecurring INTEGER NOT NULL DEFAULT 0,
        recurringType TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_spending_date ON spending(date);
      CREATE INDEX IF NOT EXISTS idx_spending_category ON spending(category);
    `;

    try {
      await this.database.execute(createSpendingTable);
      await this.database.execute(createIndexes);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  getDatabaseState() {
    return this.isDbReady.asObservable();
  }

  async executeQuery(query: string, values?: any[]) {
    if (!this.isDbReady.value) {
      throw new Error('Database is not ready');
    }

    try {
      return await this.database.query(query, values);
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  async executeNonQuery(query: string, values?: any[]) {
    if (!this.isDbReady.value) {
      throw new Error('Database is not ready');
    }

    try {
      return await this.database.run(query, values);
    } catch (error) {
      console.error('Error executing non-query:', error);
      throw error;
    }
  }

  async closeConnection() {
    if (this.database) {
      await this.database.close();
    }
    await this.sqlite.closeConnection(this.DB_NAME, false);
  }
}