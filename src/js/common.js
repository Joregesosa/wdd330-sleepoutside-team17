import { updateCartCount } from './utils.mjs';

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

updateCartCount();
window.addEventListener('itemInserted',  updateCartCount);