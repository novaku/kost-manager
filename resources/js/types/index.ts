export interface User {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'tenant';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  identity_number?: string;
  profile_image?: string;
  is_active: boolean;
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Kostan {
  id: number;
  owner_id: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  facilities: string[];
  rules: string[];
  images: string[];
  is_active: boolean;
  total_rooms: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  owner?: User;
  rooms?: Room[];
  available_rooms?: Room[];
  published_reviews?: Review[];
}

export interface Room {
  id: number;
  kostan_id: number;
  room_number: string;
  description?: string;
  monthly_price: number;
  deposit_amount: number;
  size?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  facilities: string[];
  images: string[];
  floor?: number;
  room_type: 'single' | 'shared' | 'studio' | 'apartment';
  max_occupancy: number;
  current_occupancy: number;
  is_active: boolean;
  last_maintenance?: string;
  created_at: string;
  updated_at: string;
  kostan?: Kostan;
  current_rental?: Rental;
  current_tenant?: User;
}

export interface Rental {
  id: number;
  room_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_paid: number;
  status: 'pending' | 'active' | 'expired' | 'terminated' | 'rejected';
  notes?: string;
  terms_conditions?: Record<string, any>;
  approved_at?: string;
  approved_by?: number;
  terminated_at?: string;
  termination_reason?: string;
  auto_renewal: boolean;
  renewal_period_months: number;
  next_payment_due?: string;
  created_at: string;
  updated_at: string;
  room?: Room;
  tenant?: User;
  approved_by_user?: User;
  payments?: Payment[];
}

export interface Payment {
  id: number;
  rental_id: number;
  tenant_id: number;
  payment_reference: string;
  amount: number;
  payment_type: 'monthly_rent' | 'deposit' | 'late_fee' | 'utility' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_method: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'cash' | 'virtual_account';
  payment_gateway?: string;
  gateway_reference?: string;
  gateway_response?: Record<string, any>;
  payment_for_month: string;
  due_date: string;
  paid_at?: string;
  late_fee: number;
  notes?: string;
  receipt_url?: string;
  is_auto_payment: boolean;
  created_at: string;
  updated_at: string;
  rental?: Rental;
  tenant?: User;
}

export interface Review {
  id: number;
  kostan_id: number;
  tenant_id: number;
  rental_id?: number;
  rating: number;
  comment?: string;
  rating_details?: Record<string, any>;
  is_verified: boolean;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  kostan?: Kostan;
  tenant?: User;
  rental?: Rental;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  priority: 'low' | 'normal' | 'high';
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
}

export interface PaginationData<T = any> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'owner' | 'tenant';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  identity_number?: string;
  kostan_id?: number;
}
