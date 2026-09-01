import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Drawer,
  List,
  Button,
  Typography,
  Empty,
  Space,
  Tag,
  Modal,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckCircleOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { CartEventPayload, CartItem } from '@mfe/shared-types';

const MFE_CART_EVENT_NAME = 'MFE_CART_EVENT';

const formatCurrency = (val: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

interface CartDrawerProps {
  readonly initialOpen?: boolean;
  readonly onClose?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ initialOpen = false, onClose }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [messageApi, contextHolder] = message.useMessage();

  const handleCartEvent = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<CartEventPayload>;
      const payload = customEvent.detail;
      if (!payload) return;

      switch (payload.type) {
        case 'ADD_ITEM': {
          if (!payload.item) break;
          const targetProduct = payload.item.product;

          setItems((prevItems) => {
            const existingIndex = prevItems.findIndex(
              (i) => i.product.id === targetProduct.id
            );

            if (existingIndex > -1) {
              return prevItems.map((item, idx) =>
                idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
              );
            }
            return [...prevItems, { product: targetProduct, quantity: 1, addedAt: new Date().toISOString() }];
          });
          break;
        }

        case 'REMOVE_ITEM': {
          if (!payload.productId) break;
          setItems((prevItems) => prevItems.filter((i) => i.product.id !== payload.productId));
          break;
        }

        case 'CLEAR_CART': {
          setItems([]);
          break;
        }

        case 'TOGGLE_DRAWER': {
          setIsOpen((prev) => (payload.isDrawerOpen !== undefined ? payload.isDrawerOpen : !prev));
          break;
        }

        default:
          break;
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener(MFE_CART_EVENT_NAME, handleCartEvent);
    return () => {
      window.removeEventListener(MFE_CART_EVENT_NAME, handleCartEvent);
    };
  }, [handleCartEvent]);

  const dispatchSyncEvent = (payload: CartEventPayload): void => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<CartEventPayload>(MFE_CART_EVENT_NAME, {
          detail: payload,
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  const updateQuantity = (productId: string, delta: number): void => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (productId: string): void => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    dispatchSyncEvent({ type: 'REMOVE_ITEM', productId });
  };

  const clearCart = (): void => {
    setItems([]);
    dispatchSyncEvent({ type: 'CLEAR_CART' });
  };

  const handleCheckout = (): void => {
    if (items.length === 0) return;

    const totalCalculated = totalAmount;

    Modal.success({
      title: 'Pedido Finalizado com Sucesso!',
      content: (
        <div>
          <p>Obrigado pela sua compra no <strong>Enterprise Store</strong>.</p>
          <p>Valor total pago: <strong>{formatCurrency(totalCalculated)}</strong></p>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Transação processada via Micro-frontend React Remote.
          </p>
        </div>
      ),
      onOk: () => {
        setItems([]);
        setIsOpen(false);
        if (onClose) onClose();
      },
    });
  };

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const totalItemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCartOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <Typography.Text strong style={{ fontSize: 16 }}>
              Carrinho de Compras
            </Typography.Text>
            <Tag color="blue" style={{ borderRadius: 10 }}>
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'}
            </Tag>
          </div>
        }
        placement="right"
        width={440}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          if (onClose) onClose();
        }}
        footer={
          items.length > 0 ? (
            <div style={{ padding: '8px 0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Typography.Text type="secondary">Total do Pedido:</Typography.Text>
                <Typography.Title level={4} style={{ margin: 0, color: '#059669' }}>
                  {formatCurrency(totalAmount)}
                </Typography.Title>
              </div>

              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={handleCheckout}
                  style={{ background: '#059669', borderColor: '#059669', fontWeight: 600 }}
                >
                  Finalizar Pedido
                </Button>

                <Button
                  type="text"
                  danger
                  block
                  icon={<ClearOutlined />}
                  onClick={clearCart}
                >
                  Esvaziar Carrinho
                </Button>
              </Space>
            </div>
          ) : null
        }
      >
        {items.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Empty
              description={
                <Typography.Text type="secondary">
                  Seu carrinho está vazio no momento.
                </Typography.Text>
              }
            />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="remove"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(item.product.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Typography.Text strong style={{ fontSize: 14 }}>
                      {item.product.name}
                    </Typography.Text>
                  }
                  description={
                    <div>
                      <Tag color="cyan" style={{ fontSize: 11, marginBottom: 4 }}>
                        {item.product.category}
                      </Tag>
                      <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          Unitário: {formatCurrency(item.product.price)}
                        </Typography.Text>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        <Space.Compact size="small">
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => updateQuantity(item.product.id, -1)}
                          />
                          <Button disabled style={{ color: '#0f172a', fontWeight: 600 }}>
                            {item.quantity}
                          </Button>
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => updateQuantity(item.product.id, 1)}
                          />
                        </Space.Compact>

                        <Typography.Text strong style={{ color: '#0f172a', marginLeft: 'auto' }}>
                          {formatCurrency(item.product.price * item.quantity)}
                        </Typography.Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};
