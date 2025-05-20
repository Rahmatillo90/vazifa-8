// Foydalanuvchi rollari
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

// Subscription statuslari
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'PENDING';

// Subscription turlari
export type SubscriptionType = 'FREE' | 'PREMIUM';

// To'lov usullari
export type PaymentMethod = 'CARD' | 'PAYME' | 'CLICK';

// Kino file turlari
export type MovieFileType = 'main' | 'trailer';

// Kino file formatlari
export type MovieFileFormat =
  | 'mp4'
  | 'mkv'
  | 'avi'
  | 'mov'
  | 'wmv'
  | 'flv'
  | 'webm';

// Kino tili
export type MovieLanguage = 'uz' | 'ru' | 'en';

// Kino statuslari
export type MovieStatus = 'draft' | 'published' | 'blocked';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type VideoQuality =
  | 'Q240P'
  | 'Q360P'
  | 'Q480P'
  | 'Q720P'
  | 'Q1080P'
  | 'Q4K'
  | 'FULLHD';

export type PlanUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
