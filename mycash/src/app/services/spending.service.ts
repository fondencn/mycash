import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatabaseService } from './database.service';
import { Spending, SpendingCategory, SpendingSummary } from '../models/spending.model';

@Injectable({
  providedIn: 'root'
})
export class SpendingService {
  private spendingsSubject = new BehaviorSubject<Spending[]>([]);
  public spendings$ = this.spendingsSubject.asObservable();

  constructor(private databaseService: DatabaseService) {
    this.loadSpendings();
  }

  async loadSpendings(): Promise<void> {
    try {
      const query = 'SELECT * FROM spending ORDER BY date DESC, createdAt DESC';
      const result = await this.databaseService.executeQuery(query);
      
      const spendings: Spending[] = result.values?.map((row: any) => ({
        id: row.id,
        description: row.description,
        amount: row.amount,
        category: row.category as SpendingCategory,
        date: new Date(row.date),
        isRecurring: Boolean(row.isRecurring),
        recurringType: row.recurringType,
        notes: row.notes,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      })) || [];

      this.spendingsSubject.next(spendings);
    } catch (error) {
      console.error('Error loading spendings:', error);
      this.spendingsSubject.next([]);
    }
  }

  async addSpending(spending: Omit<Spending, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = new Date().toISOString();
      const query = `
        INSERT INTO spending (description, amount, category, date, isRecurring, recurringType, notes, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        spending.description,
        spending.amount,
        spending.category,
        spending.date.toISOString(),
        spending.isRecurring ? 1 : 0,
        spending.recurringType || null,
        spending.notes || null,
        now,
        now
      ];

      await this.databaseService.executeNonQuery(query, values);
      await this.loadSpendings();
    } catch (error) {
      console.error('Error adding spending:', error);
      throw error;
    }
  }

  async updateSpending(spending: Spending): Promise<void> {
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE spending 
        SET description = ?, amount = ?, category = ?, date = ?, 
            isRecurring = ?, recurringType = ?, notes = ?, updatedAt = ?
        WHERE id = ?
      `;
      
      const values = [
        spending.description,
        spending.amount,
        spending.category,
        spending.date.toISOString(),
        spending.isRecurring ? 1 : 0,
        spending.recurringType || null,
        spending.notes || null,
        now,
        spending.id
      ];

      await this.databaseService.executeNonQuery(query, values);
      await this.loadSpendings();
    } catch (error) {
      console.error('Error updating spending:', error);
      throw error;
    }
  }

  async deleteSpending(id: number): Promise<void> {
    try {
      const query = 'DELETE FROM spending WHERE id = ?';
      await this.databaseService.executeNonQuery(query, [id]);
      await this.loadSpendings();
    } catch (error) {
      console.error('Error deleting spending:', error);
      throw error;
    }
  }

  async getSpendingsByCategory(category: SpendingCategory): Promise<Spending[]> {
    try {
      const query = 'SELECT * FROM spending WHERE category = ? ORDER BY date DESC';
      const result = await this.databaseService.executeQuery(query, [category]);
      
      return result.values?.map((row: any) => ({
        id: row.id,
        description: row.description,
        amount: row.amount,
        category: row.category as SpendingCategory,
        date: new Date(row.date),
        isRecurring: Boolean(row.isRecurring),
        recurringType: row.recurringType,
        notes: row.notes,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      })) || [];
    } catch (error) {
      console.error('Error getting spendings by category:', error);
      return [];
    }
  }

  async getSpendingSummary(): Promise<SpendingSummary> {
    try {
      const totalQuery = 'SELECT SUM(amount) as total, COUNT(*) as count FROM spending';
      const categoryQuery = 'SELECT category, SUM(amount) as total FROM spending GROUP BY category';
      
      const totalResult = await this.databaseService.executeQuery(totalQuery);
      const categoryResult = await this.databaseService.executeQuery(categoryQuery);
      
      const total = totalResult.values?.[0]?.total || 0;
      const count = totalResult.values?.[0]?.count || 0;
      
      const categoryBreakdown: { [key in SpendingCategory]?: number } = {};
      categoryResult.values?.forEach((row: any) => {
        categoryBreakdown[row.category as SpendingCategory] = row.total;
      });

      // Calculate monthly average (assuming data for last 12 months)
      const monthlyAverage = count > 0 ? total / Math.max(1, Math.ceil(count / 30)) : 0;

      return {
        totalAmount: total,
        count,
        categoryBreakdown,
        monthlyAverage
      };
    } catch (error) {
      console.error('Error getting spending summary:', error);
      return {
        totalAmount: 0,
        count: 0,
        categoryBreakdown: {},
        monthlyAverage: 0
      };
    }
  }

  getCurrentSpendings(): Spending[] {
    return this.spendingsSubject.value;
  }
}