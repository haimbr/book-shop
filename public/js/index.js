import {logIn} from './utils/login.js';
import {signUp} from './utils/signup.js';
import {logOut} from './utils/logout.js';
import {updateShoppingCartInCookies} from './utils/shopping-cart.js';






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

if(isUserLoggedIn){
    unregisteredUser.style.display = 'none';
}else{
    registeredUserIcon.style.display = 'none';
}

registeredUserIcon.addEventListener('click', (event) => {
    if(logoutButton.style.display !== 'block'){
        logoutButton.style.display = 'block';
    }else{
        logoutButton.style.display = 'none';
    }
})

logoutButton.addEventListener('click', () => {
    logOut();
})
 



// updates the shoppingCart in click the add-to-cart button
const addToCart = document.querySelectorAll('.add-to-cart button')
const cartCount = document.querySelector('.shopping-cart-count')

addToCart.forEach((element) => {
    element.addEventListener('click', async (event) => {
        const book = event.target.parentNode.parentNode.querySelector('.book-name').innerText;
        const author = event.target.parentNode.parentNode.querySelector('.book-author').innerText;
        try{
            const res = await fetch(`/users/update-shoppingCart?book=${book}&author=${author}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });


        const data = await res.json();
        if(!Array.isArray(data)){
            updateShoppingCartInCookies(data, 'add')
        }
        
        cartCount.innerText = parseInt(cartCount.innerText) + 1;
            
        }catch(e){
            console.log(e);
        }
    })
})

