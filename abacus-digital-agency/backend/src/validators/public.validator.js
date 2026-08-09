const { z } = require('zod');

const contactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Please provide a valid email address'),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    company: z.string().trim().max(120).optional().or(z.literal('')),
    subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(150),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
    budgetRange: z
      .enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-specified'])
      .optional(),
    projectType: z.string().trim().max(100).optional().or(z.literal('')),
  }),
});

const newsletterSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Please provide a valid email address'),
    source: z.string().trim().optional(),
  }),
});

const careerApplicationSchema = z.object({
  body: z.object({
    jobPost: z.string({ required_error: 'Job post reference is required' }).trim(),
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Please provide a valid email address'),
    phone: z.string().trim().min(6, 'Please provide a valid phone number'),
    coverLetter: z.string().trim().max(3000).optional().or(z.literal('')),
    portfolioUrl: z.string().trim().url('Please provide a valid URL').optional().or(z.literal('')),
    linkedinUrl: z.string().trim().url('Please provide a valid URL').optional().or(z.literal('')),
    experienceYears: z.coerce.number().min(0).max(50).optional(),
    expectedSalary: z.string().trim().max(50).optional().or(z.literal('')),
  }),
});

module.exports = { contactSchema, newsletterSchema, careerApplicationSchema };
