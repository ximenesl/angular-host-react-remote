declare module 'cartRemote/CartApp' {
  import { ElementRef } from '@angular/core';
  
  export interface MountOptions {
    readonly container: HTMLElement;
    readonly eventBus?: any;
  }

  export type UnmountFunction = () => void;

  export function mountCartApp(options: MountOptions): UnmountFunction;
}
