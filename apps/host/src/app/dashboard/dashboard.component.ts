import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductItem, ProductStatus } from '@mfe/shared-types';
import { AuthService } from '../auth/services/auth.service';
import { ProductService } from './services/product.service';
import { CartEventService } from '../core/services/cart-event.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzIconModule,
    NzBadgeModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzEmptyModule,
  ],
  template: `
    <nz-layout class="dashboard-layout">
      <!-- Navbar / Header -->
      <nz-header class="dashboard-header">
        <div class="header-container">
          <div class="header-brand">
            <span nz-icon nzType="appstore" class="brand-icon"></span>
            <span class="brand-title">Enterprise Dashboard</span>
          </div>

          <div class="header-actions">
            <!-- Trigger do Carrinho (Integração MFE React) -->
            <button
              nz-button
              nzType="text"
              class="cart-trigger-btn"
              (click)="cartService.toggleDrawer()"
            >
              <nz-badge [nzCount]="cartService.itemCount()" [nzOverflowCount]="99">
                <span nz-icon nzType="shopping-cart" class="cart-icon"></span>
              </nz-badge>
              <span class="cart-label">Carrinho</span>
            </button>

            <div class="user-profile">
              <span class="user-name">{{ currentUser()?.name }}</span>
              <span class="user-role-tag">{{ currentUser()?.role }}</span>
            </div>

            <button
              nz-button
              nzType="default"
              nzDanger
              nzSize="small"
              (click)="authService.logout()"
            >
              <span nz-icon nzType="logout"></span> Sair
            </button>
          </div>
        </div>
      </nz-header>

      <!-- Main Content -->
      <nz-content class="dashboard-content">
        <div class="content-container">
          <!-- Filtros e Ações da Tabela -->
          <nz-card class="filter-card" [nzBordered]="false">
            <form nz-form [formGroup]="filterForm" nzLayout="vertical">
              <div class="filter-grid">
                <!-- Busca por Nome -->
                <nz-form-item>
                  <nz-form-label>Nome do Produto</nz-form-label>
                  <nz-form-control>
                    <nz-input-group nzPrefixIcon="search">
                      <input
                        nz-input
                        formControlName="name"
                        placeholder="Buscar por nome..."
                      />
                    </nz-input-group>
                  </nz-form-control>
                </nz-form-item>

                <!-- Categoria -->
                <nz-form-item>
                  <nz-form-label>Categoria</nz-form-label>
                  <nz-form-control>
                    <nz-select
                      formControlName="category"
                      nzAllowClear
                      nzPlaceHolder="Todas as categorias"
                    >
                      @for (cat of productService.categories(); track cat) {
                        <nz-option [nzValue]="cat" [nzLabel]="cat"></nz-option>
                      }
                    </nz-select>
                  </nz-form-control>
                </nz-form-item>

                <!-- Data de Criação -->
                <nz-form-item>
                  <nz-form-label>Data de Cadastro</nz-form-label>
                  <nz-form-control>
                    <nz-date-picker
                      formControlName="createdAt"
                      nzFormat="yyyy-MM-dd"
                      nzPlaceHolder="Selecione a data"
                      class="full-width"
                    ></nz-date-picker>
                  </nz-form-control>
                </nz-form-item>

                <!-- Status -->
                <nz-form-item>
                  <nz-form-label>Status do Estoque</nz-form-label>
                  <nz-form-control>
                    <nz-select
                      formControlName="status"
                      nzAllowClear
                      nzPlaceHolder="Todos os status"
                    >
                      <nz-option nzValue="AVAILABLE" nzLabel="Em Estoque"></nz-option>
                      <nz-option nzValue="LOW_STOCK" nzLabel="Estoque Baixo"></nz-option>
                      <nz-option nzValue="OUT_OF_STOCK" nzLabel="Esgotado"></nz-option>
                    </nz-select>
                  </nz-form-control>
                </nz-form-item>
              </div>

              <div class="filter-actions">
                <button nz-button nzType="default" (click)="resetFilters()">
                  <span nz-icon nzType="reload"></span> Limpar Filtros
                </button>

                <button nz-button nzType="primary" (click)="openCreateModal()">
                  <span nz-icon nzType="plus"></span> Novo Item +
                </button>
              </div>
            </form>
          </nz-card>

          <!-- Tabela Principal de Produtos -->
          <nz-card class="table-card" [nzBordered]="false">
            <nz-table
              #productTable
              [nzData]="productService.filteredProducts()"
              [nzPageSize]="6"
              nzSize="middle"
            >
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Descrição</th>
                  <th nzAlign="center">Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (item of productTable.data; track item.id) {
                  <tr>
                    <td class="font-semibold">{{ item.name }}</td>
                    <td><nz-tag>{{ item.category }}</nz-tag></td>
                    <td class="font-bold text-emerald">{{ item.price | currency : 'BRL' }}</td>
                    <td>
                      @switch (item.status) {
                        @case ('AVAILABLE') {
                          <nz-tag nzColor="success">Em Estoque</nz-tag>
                        }
                        @case ('LOW_STOCK') {
                          <nz-tag nzColor="warning">Estoque Baixo</nz-tag>
                        }
                        @case ('OUT_OF_STOCK') {
                          <nz-tag nzColor="error">Esgotado</nz-tag>
                        }
                      }
                    </td>
                    <td class="description-cell" [title]="item.description">
                      {{ item.description }}
                    </td>
                    <td nzAlign="center">
                      <button
                        nz-button
                        nzType="primary"
                        nzSize="small"
                        [disabled]="item.status === 'OUT_OF_STOCK'"
                        (click)="addToCart(item)"
                      >
                        <span nz-icon nzType="shopping-cart"></span> Adicionar ao Carrinho
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </nz-table>
          </nz-card>
        </div>
      </nz-content>

      <!-- Modal de Criação de Produto -->
      <nz-modal
        [(nzVisible)]="isModalVisible"
        nzTitle="Cadastrar Novo Produto"
        (nzOnCancel)="closeCreateModal()"
        (nzOnOk)="submitCreateProduct()"
        [nzOkLoading]="isSubmittingModal()"
        nzOkText="Salvar Produto"
        nzCancelText="Cancelar"
      >
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="productForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label nzRequired>Nome do Produto</nz-form-label>
              <nz-form-control nzErrorTip="O nome do produto é obrigatório.">
                <input nz-input formControlName="name" placeholder="Ex: Monitor Gaming 27''" />
              </nz-form-control>
            </nz-form-item>

            <div class="form-row">
              <nz-form-item class="flex-1">
                <nz-form-label nzRequired>Categoria</nz-form-label>
                <nz-form-control nzErrorTip="A categoria é obrigatória.">
                  <input nz-input formControlName="category" placeholder="Ex: Eletrônicos" />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item class="flex-1">
                <nz-form-label nzRequired>Preço (R$)</nz-form-label>
                <nz-form-control nzErrorTip="Informe um valor numérico válido.">
                  <nz-input-number
                    formControlName="price"
                    [nzMin]="0"
                    [nzStep]="10"
                    class="full-width"
                    nzPlaceHolder="0.00"
                  ></nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>

            <div class="form-row">
              <nz-form-item class="flex-1">
                <nz-form-label nzRequired>Status Inicial</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="status">
                    <nz-option nzValue="AVAILABLE" nzLabel="Em Estoque"></nz-option>
                    <nz-option nzValue="LOW_STOCK" nzLabel="Estoque Baixo"></nz-option>
                    <nz-option nzValue="OUT_OF_STOCK" nzLabel="Esgotado"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item class="flex-1">
                <nz-form-label>Ativo na Loja</nz-form-label>
                <nz-form-control>
                  <nz-switch formControlName="isActive"></nz-switch>
                </nz-form-control>
              </nz-form-item>
            </div>

            <nz-form-item>
              <nz-form-label nzRequired>Descrição do Produto</nz-form-label>
              <nz-form-control nzErrorTip="A descrição deve conter pelo menos 10 caracteres.">
                <textarea
                  nz-input
                  formControlName="description"
                  rows="3"
                  placeholder="Escreva detalhes técnicos do produto..."
                ></textarea>
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>
    </nz-layout>
  `,
  styles: [
    `
      .dashboard-layout {
        min-height: 100vh;
        background-color: #f8fafc;
      }

      .dashboard-header {
        background: #0f172a;
        padding: 0 1.5rem;
        height: 64px;
        line-height: 64px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1280px;
        margin: 0 auto;
      }

      .header-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #ffffff;
      }

      .brand-icon {
        font-size: 22px;
        color: #38bdf8;
      }

      .brand-title {
        font-size: 1.125rem;
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .cart-trigger-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #94a3b8;
        padding: 0 0.75rem;

        &:hover {
          color: #ffffff;
        }
      }

      .cart-icon {
        font-size: 20px;
      }

      .cart-label {
        font-weight: 500;
        font-size: 0.875rem;
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #f8fafc;
      }

      .user-name {
        font-weight: 600;
        font-size: 0.875rem;
      }

      .user-role-tag {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
        padding: 0.125rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .dashboard-content {
        padding: 2rem 1.5rem;
      }

      .content-container {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .filter-card,
      .table-card {
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }

      .filter-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .filter-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
      }

      .full-width {
        width: 100%;
      }

      .font-semibold {
        font-weight: 600;
      }

      .font-bold {
        font-weight: 700;
      }

      .text-emerald {
        color: #059669;
      }

      .description-cell {
        max-width: 280px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #64748b;
      }

      .form-row {
        display: flex;
        gap: 1rem;

        .flex-1 {
          flex: 1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly nzMessage = inject(NzMessageService);
  public readonly authService = inject(AuthService);
  public readonly productService = inject(ProductService);
  public readonly cartService = inject(CartEventService);

  public readonly currentUser = this.authService.currentUser;

  public readonly isModalVisible = signal<boolean>(false);
  public readonly isSubmittingModal = signal<boolean>(false);

  public readonly filterForm: FormGroup = this.fb.group({
    name: [''],
    category: [null],
    createdAt: [null],
    status: [null],
  });

  public readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    price: [null, [Validators.required, Validators.min(0.01)]],
    status: ['AVAILABLE', [Validators.required]],
    isActive: [true],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.filterForm.valueChanges.subscribe((values) => {
      const formattedDate = values.createdAt
        ? new Date(values.createdAt).toISOString().split('T')[0]
        : undefined;

      this.productService.updateFilters({
        name: values.name || undefined,
        category: values.category || undefined,
        createdAt: formattedDate,
        status: values.status || undefined,
      });
    });
  }

  public resetFilters(): void {
    this.filterForm.reset();
    this.productService.resetFilters();
  }

  public addToCart(product: ProductItem): void {
    this.cartService.addItem(product);
    this.nzMessage.success(`"${product.name}" adicionado ao carrinho!`);
  }

  public openCreateModal(): void {
    this.productForm.reset({ status: 'AVAILABLE', isActive: true });
    this.isModalVisible.set(true);
  }

  public closeCreateModal(): void {
    this.isModalVisible.set(false);
  }

  public submitCreateProduct(): void {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isSubmittingModal.set(true);

    const formValues = this.productForm.value;

    this.productService.addProduct({
      name: formValues.name,
      category: formValues.category,
      price: formValues.price,
      status: formValues.status as ProductStatus,
      isActive: formValues.isActive,
      description: formValues.description,
    });

    this.isSubmittingModal.set(false);
    this.isModalVisible.set(false);
    this.nzMessage.success('Novo produto cadastrado com sucesso!');
  }
}
