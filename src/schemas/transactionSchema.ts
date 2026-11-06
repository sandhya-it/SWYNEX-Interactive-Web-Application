import { z } from 'zod';

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(80, 'Title cannot exceed 80 characters'),
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .max(100000000, 'Amount is too large'),
  type: z.enum(['income', 'expense'] as const),
  category: z
    .string()
    .trim()
    .min(1, 'Please select or enter a category'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  paymentMethod: z.enum(
    ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking', 'Other'] as const
  ),
  description: z
    .string()
    .trim()
    .max(250, 'Description cannot exceed 250 characters')
    .optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const categoryBudgetSchema = z.object({
  category: z.string().trim().min(1, 'Category is required'),
  allocatedAmount: z
    .number()
    .positive('Budget amount must be greater than zero'),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
});

export type CategoryBudgetFormData = z.infer<typeof categoryBudgetSchema>;

export const overallBudgetSchema = z.object({
  amount: z
    .number()
    .positive('Monthly budget must be greater than zero'),
});

export type OverallBudgetFormData = z.infer<typeof overallBudgetSchema>;
