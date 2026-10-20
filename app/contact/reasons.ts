/** Contact reasons — shared by the form and /api/contact (keep the two in sync). */
export const REASONS = ['Collaboration', 'Licensing / sync', 'Booking', 'Press', 'Demo', 'Other'] as const
export type Reason = (typeof REASONS)[number]
