import { Injectable, signal, computed } from '@angular/core';
import { ProductFilter, ProductItem, ProductStatus } from '@mfe/shared-types';

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Eletrônicos',
    price: 24999.0,
    isActive: true,
    status: 'AVAILABLE',
    description: 'Chip M3 Max com CPU de 16 núcleos, GPU de 40 núcleos e 48GB de RAM unificada.',
    createdAt: '2026-08-15',
  },
  {
    id: 'prod-002',
    name: 'Dell UltraSharp 32 4K USB-C Hub',
    category: 'Periféricos',
    price: 4899.9,
    isActive: true,
    status: 'AVAILABLE',
    description: 'Monitor IPS Black 4K HDR400 com tecnologia ComfortView Plus e hub Ethernet.',
    createdAt: '2026-08-18',
  },
  {
    id: 'prod-003',
    name: 'Teclado Mecânico Keychron Q1 Pro',
    category: 'Periféricos',
    price: 1350.0,
    isActive: true,
    status: 'LOW_STOCK',
    description: 'Teclado sem fio personalizado com estrutura de alumínio, QMK/VIA e switches Gateron.',
    createdAt: '2026-08-20',
  },
  {
    id: 'prod-004',
    name: 'Cadeira Ergonômica Herman Miller Embody',
    category: 'Móveis',
    price: 12900.0,
    isActive: true,
    status: 'AVAILABLE',
    description: 'Design biomecânico premium para máxima ergonomia e suporte à postura de trabalho.',
    createdAt: '2026-08-22',
  },
  {
    id: 'prod-005',
    name: 'Fone de Ouvido Sony WH-1000XM5',
    category: 'Áudio',
    price: 2199.0,
    isActive: true,
    status: 'OUT_OF_STOCK',
    description: 'Cancelamento de ruído com 8 microfones, áudio Hi-Res e bateria para 30 horas.',
    createdAt: '2026-08-25',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsState = signal<ProductItem[]>(INITIAL_PRODUCTS);
  private readonly filterState = signal<ProductFilter>({});

  public readonly products = computed(() => this.productsState());
  public readonly filters = computed(() => this.filterState());

  public readonly categories = computed(() => {
    const list = this.productsState().map((p) => p.category);
    return Array.from(new Set(list)).sort();
  });

  public readonly filteredProducts = computed(() => {
    const items = this.productsState();
    const f = this.filterState();

    return items.filter((item) => {
      if (f.name && !item.name.toLowerCase().includes(f.name.toLowerCase().trim())) {
        return false;
      }

      if (f.category && item.category !== f.category) {
        return false;
      }

      if (f.status && item.status !== f.status) {
        return false;
      }

      if (f.createdAt && item.createdAt !== f.createdAt) {
        return false;
      }

      return true;
    });
  });

  public updateFilters(newFilters: ProductFilter): void {
    this.filterState.set({ ...this.filterState(), ...newFilters });
  }

  public resetFilters(): void {
    this.filterState.set({});
  }

  public addProduct(newProductData: Omit<ProductItem, 'id' | 'createdAt'>): void {
    const newProduct: ProductItem = {
      ...newProductData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.productsState.set([newProduct, ...this.productsState()]);
  }
}
