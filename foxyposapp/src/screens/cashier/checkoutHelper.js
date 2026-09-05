export function calculateCheckout({
    price,
    customer
}) {

    const subtotal =
        Number(price) * Number(customer);
    const vat =
        Number((subtotal * 0.07).toFixed(2));
    const total =
        Number((subtotal + vat).toFixed(2));
    return {
        subtotal,
        vat,
        total
    };

}