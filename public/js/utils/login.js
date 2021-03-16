

export const logIn = async () => {
    const logInform = document.querySelector('.login-form');
    const emailError = logInform.querySelector('.email.error');
    const passwordError = logInform.querySelector('.password.error');

    // reset errors
    emailError.textContent = '';
    passwordError.textContent = '';
    // get values
    const email = logInform.email.value;
    const password = logInform.password.value;

    try {
        const res = await fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        if (data.errors) {
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        } else {
            document.querySelector('.login-container').style.display = 'none';
            location.reload();
        }
    } catch (e) {
        console.log("login error:", e);
    }
}