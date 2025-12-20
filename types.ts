
export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_admin?: boolean;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed';
  owner_id: number;
  created_at: string;
  price: number;
  image_url?: string;
  stock_quantity?: number;
}

export interface CartItem extends Item {
  quantity: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface APIError {
  detail: string;
}

export type View = 'home' | 'shop' | 'cart' | 'dashboard' | 'items' | 'ai-assistant';
