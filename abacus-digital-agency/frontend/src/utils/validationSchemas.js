import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  company: z.string().trim().optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Please enter a subject').max(150),
  message: z.string().trim().min(10, 'Please tell us a bit more (min. 10 characters)').max(3000),
  budgetRange: z.enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-specified']).optional(),
  projectType: z.string().trim().optional().or(z.literal('')),
});

export const applicationFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(6, 'Please enter a valid phone number'),
  coverLetter: z.string().trim().max(3000).optional().or(z.literal('')),
  portfolioUrl: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  linkedinUrl: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  experienceYears: z.coerce.number().min(0).max(50).optional(),
  expectedSalary: z.string().trim().optional().or(z.literal('')),
});
