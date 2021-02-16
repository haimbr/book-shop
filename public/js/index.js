import {logIn} from './utils/login.js';
import {signUp} from './utils/signup.js';
import {logOut} from './utils/logout.js';



const logInButton = document.querySelectorAll('.login-and-signup i')[0];
const signUpButton = document.querySelectorAll('.login-and-signup i')[1];
const loginContainer = document.querySelector('.login-container');
const signUpContainer = document.querySelector('.signup-container');


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
const isUserLoggedIn = document.querySelector('.user-logged-in') ? true : false;


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
