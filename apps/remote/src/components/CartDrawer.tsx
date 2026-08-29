import React from 'react';
import { Drawer, Empty, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface CartDrawerProps {
  readonly isVisible: boolean;
  readonly onClose?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isVisible, onClose }) => {
  return (
    <Drawer
      title={
        <span>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          Carrinho de Compras (Remote MFE)
        </span>
      }
      placement="right"
      width={400}
      open={isVisible}
      onClose={onClose}
    >
      <Empty description="Nenhum item adicionado ao carrinho" />
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button type="primary" disabled block>
          Finalizar Pedido
        </Button>
      </div>
    </Drawer>
  );
};
