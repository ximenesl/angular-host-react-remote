import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
      <h2>Auth Feature Scaffold - Login Screen</h2>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
