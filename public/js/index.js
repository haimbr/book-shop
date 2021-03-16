import { logIn } from './utils/login.js';
import { signUp } from './utils/signup.js';
import { logOut } from './utils/logout.js';
import { updateShoppingCartCookies } from './utils/shopping-cart.js';






const logInButton = document.querySelectorAll('.login-and-signup i')[0];
const signUpButton = document.querySelectorAll('.login-and-signup i')[1];
const loginContainer = document.querySelector('.login-container');
const signUpContainer = document.querySelector('.signup-container');
export const isUserLoggedIn = document.querySelector('.user-logged-in') != undefined;

// handle login and signup buttons
logInButton.addEventListener('click', () => {
    loginContainer.style.display = 'block';
})

signUpButton.addEventListener('click', () => {
    signUpContainer.style.display = 'block';
})

document.body.addEventListener('click', (event) => {
    if (!event.target.classList.contains('backdrop')) return;

    loginContainer.style.display = 'none';
    signUpContainer.style.display = 'none';
})



const logInform = document.querySelector('.login-form');
logInform.addEventListener('submit', async (e) => {
    e.preventDefault();
    logIn();
});

const signupForm = document.querySelector('.signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signUp();
});


// handle registered users icon and logout button
const registeredUserIcon = document.querySelector('.registered-user');
const logoutButton = document.querySelector('.logout-button');
const unregisteredUser = document.querySelector('.unregistered-user');

if (isUserLoggedIn) {
    unregisteredUser.style.display = 'none';
} else {
    registeredUserIcon.style.display = 'none';
}

registeredUserIcon.addEventListener('click', (event) => {
    if (logoutButton.style.display !== 'block') {
        logoutButton.style.display = 'block';
    } else {
        logoutButton.style.display = 'none';
    }
})

logoutButton.addEventListener('click', () => {
    logOut();
})




// updates the shoppingCart in click the add-to-cart button
const addToCartButton = document.querySelectorAll('.add-to-cart button')
const cartCount = document.querySelector('.shopping-cart-count')

addToCartButton.forEach((element) => {
    element.addEventListener('click', (event) => addToCart(event))
})


async function addToCart(event) {
    const book = event.path[3].querySelector('.book-name').innerText;
    const author = event.path[3].querySelector('.book-author').innerText.replace('מחבר:', '');

    try {
        const res = await fetch(`/users/update-shoppingCart?book=${book}&author=${author}&method=add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();
        if (!Array.isArray(data)) {
            updateShoppingCartCookies(data, 'add')
        }

        cartCount.innerText = parseInt(cartCount.innerText) + 1;
        if (event.target.classList.contains('buy-now')) {
            window.location = '/shopping-cart';
        }

    } catch (e) {
        console.log(e);
    }
}



// handle with getting books details

const bookDetails = document.querySelectorAll('.book-name-link, .book-img')

bookDetails.forEach((book) => {
    book.addEventListener('click', (event) => getBookDetails(event))
})

function getBookDetails(event) {
    event.preventDefault();
    const book = event.path[2].querySelector('.book-name').innerText;
    const author = event.path[2].querySelector('.book-author').innerText.replace('מחבר:', '');
    window.location = `/book-details?book=${book}&author=${author}`
}



// handle with line breaks in the description of the book
const bookDescription = document.querySelector('.book-description');
if (bookDescription) {
    bookDescription.innerHTML = bookDescription.innerText;
}



// handle with the pagination

if (document.querySelector('.pagination')) {
    const pagination = document.querySelector('.pagination').children;
    for (let item of pagination) {
        item.addEventListener('click', (event) => getRequestedPage(event.target));
    };
}




function getRequestedPage(paginationElement) {
    const category = document.querySelector('.main-content-header').innerText;
    let requestedPage = parseInt(paginationElement.innerText.replace('...', ''));
    if (isNaN(requestedPage)) {
        const currentPage = parseInt(document.querySelector('.current-page').innerText);
        requestedPage = currentPage + (paginationElement.classList.contains('pagination-next') ? 1 : -1);
    }
    window.location = `/get-books?category=${category}&requestedPage=${requestedPage}`
}
