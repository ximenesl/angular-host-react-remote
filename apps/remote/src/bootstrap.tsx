import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from './App';

export interface MountOptions {
  readonly container: HTMLElement;
  readonly eventBus?: any;
}

const rootsMap = new WeakMap<HTMLElement, Root>();

export const mountCartApp = ({ container }: MountOptions): (() => void) => {
  let root = rootsMap.get(container);
  if (!root) {
    root = createRoot(container);
    rootsMap.set(container, root);
  }

  root.render(<App isDrawerVisible={false} />);

  return () => {
    setTimeout(() => {
      root?.unmount();
      rootsMap.delete(container);
    }, 0);
  };
};

// Modos de inicialização standalone para testes e desenvolvimento isolado
const standaloneContainer = document.getElementById('root');
if (standaloneContainer && process.env.NODE_ENV === 'development') {
  const root = createRoot(standaloneContainer);
  root.render(<App isDrawerVisible={true} />);
}
