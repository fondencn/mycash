export interface Spending {
  id?: number;
  description: string;
  amount: number;
  category: SpendingCategory;
  date: Date;
  isRecurring: boolean;
  recurringType?: RecurringType;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SpendingCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  UTILITIES = 'utilities',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  SHOPPING = 'shopping',
  RENT = 'rent',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

export enum RecurringType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface SpendingSummary {
  totalAmount: number;
  count: number;
  categoryBreakdown: { [key in SpendingCategory]?: number };
  monthlyAverage: number;
}