import { loadHeaderFooter, qs } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

qs("#zip")
    .addEventListener("blur", order.calculateOrderTotal.bind(order));

qs("#checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    order.checkout(e.target);
});
