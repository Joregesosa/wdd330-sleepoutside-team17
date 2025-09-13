import { qs, getLocalStorage } from './utils.mjs';

const originalSetItem = localStorage.setItem;

localStorage.setItem = function (key, value) {
    try {
        const event = new CustomEvent('itemInserted', { detail: { key, value } });
        originalSetItem.apply(this, arguments);
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Error setting localStorage item:', error);
        throw error;
    }
}

function updateCartCount() {
    const cart = qs('.cart');
    const cartCount = qs('.cart__count');
    cartCount?.remove();
    const cartItems = getLocalStorage('so-cart') || [];
    const itemCount = cartItems.length;
    console.log(itemCount);
    if (itemCount > 0) {
        const template = `<span class="cart__count">${itemCount}</span>`;
        cart.insertAdjacentHTML('beforeend', template);
    }
}

updateCartCount();
window.addEventListener('itemInserted',  updateCartCount);