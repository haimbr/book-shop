
// import {displayRegisteredUserIcon} from './login.js';

export const signUp = async () => {
    const signupForm = document.querySelector('.signup-form');
    const emailError = signupForm.querySelector('.email.error');
    const passwordError = signupForm.querySelector('.password.error');
    
    // reset errors
    emailError.textContent = '';
    passwordError.textContent = '';
    // get values
    const email = signupForm.email.value;
    const userName = signupForm.name.value;
    const password = signupForm.password.value;

    try{
        const res = await fetch('/users/signUp', {
            method: 'POST',
            body: JSON.stringify({ userName, email , password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if(data.errors){
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }else{
            document.querySelector('.signup-container').style.display = 'none';
            location.reload();
        }
    }catch(e){
        console.log("Sign up error:", e);
    }

}


