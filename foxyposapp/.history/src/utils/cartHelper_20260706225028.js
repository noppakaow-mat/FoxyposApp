// src/utils/cartHelper.js

export const createCart = () => ({
  items: [],
});

// เพิ่มสินค้า
export const addItem = (cart, product) => {
  const existing = cart.items.find((i) => i.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.items.push({
      ...product,
      qty: 1,
    });
  }

  return { ...cart };
};

// ลดสินค้า
export const decreaseItem = (cart, productId) => {
  const item = cart.items.find((i) => i.id === productId);

  if (!item) return cart;

  item.qty -= 1;

  if (item.qty <= 0) {
    cart.items = cart.items.filter((i) => i.id !== productId);
  }

  return { ...cart };
};

// ล้างตะกร้า
export const clearCart = () => ({
  items: [],
});

// รวมจำนวน
export const getTotalQty = (cart) =>
  cart.items.reduce((sum, i) => sum + i.qty, 0);

// ราคารวม
export const getTotalPrice = (cart) =>
  cart.items.reduce((sum, i) => sum + i.qty * i.price, 0);