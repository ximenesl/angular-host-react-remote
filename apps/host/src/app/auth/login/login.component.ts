import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzAlertModule,
  ],
  template: `
    <div class="login-wrapper">
      <nz-card class="login-card" [nzBordered]="false">
        <div class="login-header">
          <div class="brand-logo">
            <span nz-icon nzType="shield" nzTheme="outline"></span>
          </div>
          <h2 class="title">Enterprise Portal</h2>
        </div>

        @if (errorMessage()) {
          <nz-alert
            nzType="error"
            [nzMessage]="errorMessage()!"
            nzShowIcon
            class="alert-margin"
          ></nz-alert>
        }

        <form nz-form [formGroup]="loginForm" (ngSubmit)="onSubmit()" nzLayout="vertical">
          <nz-form-item>
            <nz-form-label nzRequired nzFor="email">E-mail Corporativo</nz-form-label>
            <nz-form-control [nzErrorTip]="emailErrorTip">
              <nz-input-group nzPrefixIcon="user">
                <input
                  nz-input
                  formControlName="email"
                  id="email"
                  placeholder="exemplo@empresa.com"
                  autocomplete="email"
                />
              </nz-input-group>
              <ng-template #emailErrorTip let-control>
                @if (control.hasError('required')) {
                  O e-mail é obrigatório.
                } @else if (control.hasError('email')) {
                  Informe um endereço de e-mail válido.
                }
              </ng-template>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label nzRequired nzFor="password">Senha de Acesso</nz-form-label>
            <nz-form-control [nzErrorTip]="passwordErrorTip">
              <nz-input-group nzPrefixIcon="lock">
                <input
                  nz-input
                  type="password"
                  formControlName="password"
                  id="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
              </nz-input-group>
              <ng-template #passwordErrorTip let-control>
                @if (control.hasError('required')) {
                  A senha é obrigatória.
                } @else if (control.hasError('minlength')) {
                  A senha deve possuir no mínimo 6 caracteres.
                }
              </ng-template>
            </nz-form-control>
          </nz-form-item>

          <button
            nz-button
            nzType="primary"
            nzBlock
            nzSize="large"
            [nzLoading]="isLoading()"
            [disabled]="isLoading()"
            type="submit"
            class="submit-button"
          >
            Entrar na Plataforma
          </button>
        </form>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        padding: 1.5rem;
      }

      .login-card {
        width: 100%;
        max-width: 440px;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
        background: #ffffff;
        padding: 1rem;
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .brand-logo {
        width: 48px;
        height: 48px;
        background: rgba(24, 144, 255, 0.1);
        color: #1890ff;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-bottom: 1rem;
      }

      .title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.25rem;
      }

      .subtitle {
        color: #64748b;
        font-size: 0.875rem;
      }

      .alert-margin {
        margin-bottom: 1.5rem;
      }

      .submit-button {
        margin-top: 1rem;
        font-weight: 600;
        border-radius: 6px;
        height: 44px;
      }

      .login-footer {
        margin-top: 2rem;
        text-align: center;
        color: #94a3b8;
        font-size: 0.75rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly nzMessage = inject(NzMessageService);

  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly loginForm: FormGroup = this.fb.group({
    email: ['lucas@empresa.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, passwordHash: password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.nzMessage.success(`Bem-vindo de volta, ${response.user.name}!`);
        
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Falha na autenticação. Verifique os dados fornecidos.');
        this.nzMessage.error('Não foi possível autenticar o usuário.');
      },
    });
  }
}
