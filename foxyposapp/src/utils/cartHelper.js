// src/utils/cartHelper.js

export const addItem = (cart, product) => {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, qty: item.qty + 1 }
        : item
    );
  }

  return [...cart, { ...product, qty: 1 }];
};

export const decreaseItem = (cart, productId) => {
  return cart
    .map(item =>
      item.id === productId
        ? { ...item, qty: item.qty - 1 }
        : item
    )
    .filter(item => item.qty > 0);
};

export const clearCart = () => [];
  
export const getTotalItems = (cart) =>
  cart.reduce((sum, item) => sum + item.qty, 0);

export const getTotalPrice = (cart) =>
  cart.reduce((sum, item) => sum + item.qty * item.price, 0);