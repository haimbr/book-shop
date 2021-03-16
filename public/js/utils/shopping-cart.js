import { isUserLoggedIn } from '../index.js';


// handle with changing the quantity of the item
const quantityButtons = document.querySelectorAll('.quantity-buttons span');
for (let i = 0; i < quantityButtons.length; i++) {
    quantityButtons[i].addEventListener('click', (event) => {
        const bookDetails = event.path[3].querySelector('.book-details').children;
        const book = bookDetails[0].innerText;
        const author = bookDetails[1].innerText;
        const quantity = event.path[2].querySelector('p');
        const bookElement = event.path[3];
        let method = i % 2 === 0 ? "add" : "remove";
        updateShoppingCart(quantity, book, author, method, bookElement);
    })
}

// handle with removing a book from the shopping-cart
document.querySelectorAll('.remove-book').forEach((element) => {
    element.addEventListener('click', (event) => {
        const bookElement = event.target.parentNode;
        const quantity = bookElement.querySelector('.quantity-container p');
        const book = bookElement.querySelector('.book-details').children[0].innerText;
        const author = bookElement.querySelector('.book-details').children[1].innerText;
        updateShoppingCart(quantity, book, author, "removeAll", bookElement);
    })
})


async function updateShoppingCart(quantity, book, author, method, bookElement) {
    try {
        const res = await fetch(`/users/update-shoppingCart?book=${book}&author=${author}&method=${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();
        if (!data.message && !isUserLoggedIn) {
            updateShoppingCartCookies(data, method)
        }
        updateUiShoppingCart(quantity, book, author, method, bookElement);
    } catch (e) {
        console.log(e);
    }
}


function updateUiShoppingCart(quantity, book, author, method, bookElement) {
    const cartCount = document.querySelector('.shopping-cart-count');
    const methodFactor = method === "removeAll" ? -parseInt(quantity.innerText) : (method === "add" ? 1 : -1);
    cartCount.innerText = parseInt(cartCount.innerText) + methodFactor;
    quantity.innerText = parseInt(quantity.innerText) + methodFactor;
    if (quantity.innerText <= 0) {
        bookElement.remove();
    }

    const totalPrice = parseInt(document.querySelector('.total-price').innerText);
    const newPrice = totalPrice + parseInt(bookElement.querySelector('.book-details p').innerText) * methodFactor;
    document.querySelector('.total-price').innerText = newPrice;
}


export function updateShoppingCartCookies(book, method) {
    if (book.message) return;

    let shoppingCart = getCookie("shoppingCart") !== undefined ? JSON.parse(getCookie("shoppingCart")) : [];

    if (method === 'add') {
        shoppingCart.push(book);
    } else if (method === 'removeAll') {
        shoppingCart = shoppingCart.filter(item => item !== book);
    } else {
        const index = shoppingCart.findIndex(element => element == book)
        if (index >= 0) {
            shoppingCart.splice(index, 1)
        }
    }
    document.cookie = `shoppingCart=${JSON.stringify(shoppingCart)}`;
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

