import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { CartDrawer } from './components/CartDrawer';

interface AppProps {
  readonly isDrawerVisible?: boolean;
  readonly onCloseDrawer?: () => void;
}

export const App: React.FC<AppProps> = ({ isDrawerVisible = true, onCloseDrawer }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <CartDrawer isVisible={isDrawerVisible} onClose={onCloseDrawer} />
    </ConfigProvider>
  );
};
