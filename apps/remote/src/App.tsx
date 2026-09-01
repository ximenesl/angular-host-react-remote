import React from 'react';
import { ConfigProvider, theme } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { CartDrawer } from './components/CartDrawer';

interface AppProps {
  readonly isDrawerVisible?: boolean;
  readonly onCloseDrawer?: () => void;
}

export const App: React.FC<AppProps> = ({ isDrawerVisible = true, onCloseDrawer }) => {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <CartDrawer initialOpen={isDrawerVisible} onClose={onCloseDrawer} />
    </ConfigProvider>
  );
};
