import { getLocalStorage, qs } from "./utils.mjs";

// get the product cart list element
const productList = qs(".product-list");

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");
}

function removeItemFromCart(e) {
  const id = e.target.getAttribute("data-id"); 
  if (!id) return;
  const cartItems = getLocalStorage("so-cart") || [];
  const updatedCart = cartItems.filter((item) => item.Id !== id);
  console.log(updatedCart);
  localStorage.setItem("so-cart", JSON.stringify(updatedCart));
  e.target.closest("li").remove();
}

function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Images?.PrimarySmall}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="cart-card__remove" aria-label="Remove item from cart" data-id="${item.Id}">
      &times;
    </button>
  </li>`;

  return newItem;
}

renderCartContents();

productList.addEventListener("click", removeItemFromCart);