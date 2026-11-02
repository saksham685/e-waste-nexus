import { z } from 'zod';

export const wasteCategories = [
  'Smartphones and Tablets',
  'Laptops and Computers',
  'Batteries and Chargers',
  'Televisions and Monitors',
  'Printers and Office Electronics',
  'Large Electrical Appliances',
  'Other Electronic Waste',
] as const;

export const userRoles = ['individual', 'partner', 'recycler', 'admin'] as const;

// Zod Schema for Pickup Request
export const pickupRequestSchema = z.object({
  category: z.enum([
    'Smartphones and Tablets',
    'Laptops and Computers',
    'Batteries and Chargers',
    'Televisions and Monitors',
    'Printers and Office Electronics',
    'Large Electrical Appliances',
    'Other Electronic Waste',
  ]),
  estimatedQuantity: z.coerce
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(1000, 'For bulk disposal over 1000 units, please contact enterprise dispatch'),
  estimatedWeightKg: z.coerce
    .number()
    .min(0.1, 'Weight must be at least 0.1 kg')
    .max(5000, 'Weight cannot exceed 5,000 kg per single pickup manifest'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long'),
  scheduledDate: z
    .string()
    .min(1, 'Please select a pickup date'),
  timeSlot: z
    .string()
    .optional(),
  specialInstructions: z
    .string()
    .max(500, 'Instructions must be under 500 characters')
    .optional(),
});

export type PickupRequestFormData = z.infer<typeof pickupRequestSchema>;

// Zod Schema for User Authentication
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  role: z.enum(['individual', 'partner', 'recycler', 'admin']),
  organization: z.string().optional(),
  phone: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Zod Schema for Partner Collection Weight Recording
export const collectionWeightSchema = z.object({
  pickupId: z.string().min(1, 'Pickup ID is required'),
  submittedWeightKg: z.coerce
    .number()
    .min(0.1, 'Calibrated scale weight must be greater than 0 kg'),
  notes: z.string().optional(),
});

export type CollectionWeightFormData = z.infer<typeof collectionWeightSchema>;

// Zod Schema for Recycler Assay
export const recyclerProcessingSchema = z.object({
  collectionRecordId: z.string().min(1, 'Collection record ID is required'),
  receivedWeightKg: z.coerce.number().min(0.1, 'Received weight required'),
  processedWeightKg: z.coerce.number().min(0.1, 'Processed yield weight required'),
  processingStatus: z.enum(['Received', 'In-Processing', 'Recycled', 'Disposed']),
  notes: z.string().optional(),
});

export type RecyclerProcessingFormData = z.infer<typeof recyclerProcessingSchema>;
