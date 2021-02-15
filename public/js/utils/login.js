


// export const displayRegisteredUserIcon = (userName) => {
//     document.querySelector('.unregistered-user').style.display = 'none';
//     document.querySelector('.registered-user').style.display = 'block';
//     const userElement = document.createElement('h5');
//     userElement.classList.add("user-logged-in");
//     userElement.innerText = `שלום ${userName}`;
//     document.querySelector('.user-name').appendChild(userElement);
// }

export const logIn = async () => {
    console.log('Login function')
    const logInform = document.querySelector('.login-form');
    const emailError = logInform.querySelector('.email.error');
    const passwordError = logInform.querySelector('.password.error');

    // reset errors
    emailError.textContent = '';
    passwordError.textContent = '';
    // get values
    const email = logInform.email.value;
    const password = logInform.password.value;

    try{
        const res = await fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email , password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(data)
        if(data.errors){
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }else{
            document.querySelector('.login-container').style.display = 'none';
            location.reload();
        }
    }catch(e){
        console.log("login error:", e);
    }
}