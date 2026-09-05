// checkoutHelper.js

/**
 * คำนวณราคาบุฟเฟ่ต์ + VAT 7%
 */
export function calculateCheckout({ pricePerPerson, people }) {
  const subtotal = pricePerPerson * people;
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  return {
    subtotal,
    vat,
    total,
  };
}

/**
 * ฟอร์แมตเงิน
 */
export function formatMoney(value) {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}