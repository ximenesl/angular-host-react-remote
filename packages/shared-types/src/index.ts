export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'ADMIN' | 'OPERATOR';
}

export interface AuthCredentials {
  readonly email: string;
  readonly passwordHash: string;
}

export interface AuthResponse {
  readonly user: User;
  readonly accessToken: string;
  readonly expiresAt: number;
}

export type ProductStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface ProductItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly isActive: boolean;
  readonly status: ProductStatus;
  readonly description: string;
  readonly createdAt: string;
}

export interface ProductFilter {
  readonly name?: string;
  readonly category?: string;
  readonly createdAt?: string;
  readonly status?: ProductStatus;
}

export interface CartItem {
  readonly product: ProductItem;
  readonly quantity: number;
  readonly addedAt: string;
}

export type CartEventType = 'ADD_ITEM' | 'REMOVE_ITEM' | 'CLEAR_CART' | 'TOGGLE_DRAWER';

export interface CartEventPayload {
  readonly type: CartEventType;
  readonly item?: CartItem;
  readonly productId?: string;
  readonly isDrawerOpen?: boolean;
}
