import { Injectable, signal, computed } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CartEventPayload, CartItem, ProductItem } from '@mfe/shared-types';

export const MFE_CART_EVENT_NAME = 'MFE_CART_EVENT';

@Injectable({
  providedIn: 'root',
})
export class CartEventService {
  private readonly eventSubject = new Subject<CartEventPayload>();
  public readonly events$: Observable<CartEventPayload> = this.eventSubject.asObservable();

  private readonly cartItemsState = signal<CartItem[]>([]);
  private readonly isDrawerOpenState = signal<boolean>(false);

  public readonly cartItems = computed(() => this.cartItemsState());
  public readonly itemCount = computed(() =>
    this.cartItemsState().reduce((total, item) => total + item.quantity, 0)
  );
  public readonly isDrawerOpen = computed(() => this.isDrawerOpenState());

  constructor() {
    this.listenToWindowEvents();
  }

  public addItem(product: ProductItem): void {
    const currentItems = [...this.cartItemsState()];
    const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      updatedItems = currentItems.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      updatedItems = [...currentItems, newItem];
    }

    this.cartItemsState.set(updatedItems);

    const payload: CartEventPayload = {
      type: 'ADD_ITEM',
      item: existingIndex > -1 ? updatedItems[existingIndex] : updatedItems[updatedItems.length - 1],
    };

    this.dispatchCartEvent(payload);
  }

  public removeItem(productId: string): void {
    const updatedItems = this.cartItemsState().filter((item) => item.product.id !== productId);
    this.cartItemsState.set(updatedItems);

    const payload: CartEventPayload = {
      type: 'REMOVE_ITEM',
      productId,
    };

    this.dispatchCartEvent(payload);
  }

  public clearCart(): void {
    this.cartItemsState.set([]);

    const payload: CartEventPayload = {
      type: 'CLEAR_CART',
    };

    this.dispatchCartEvent(payload);
  }

  public toggleDrawer(open?: boolean): void {
    const nextState = open !== undefined ? open : !this.isDrawerOpenState();
    this.isDrawerOpenState.set(nextState);

    const payload: CartEventPayload = {
      type: 'TOGGLE_DRAWER',
      isDrawerOpen: nextState,
    };

    this.dispatchCartEvent(payload);
  }

  private dispatchCartEvent(payload: CartEventPayload): void {
    this.eventSubject.next(payload);

    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent<CartEventPayload>(MFE_CART_EVENT_NAME, {
        detail: payload,
        bubbles: true,
        composed: true,
      });
      window.dispatchEvent(customEvent);
    }
  }

  private listenToWindowEvents(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener(MFE_CART_EVENT_NAME, (event: Event) => {
      const customEvent = event as CustomEvent<CartEventPayload>;
      if (customEvent.detail) {
        this.eventSubject.next(customEvent.detail);
      }
    });
  }
}
