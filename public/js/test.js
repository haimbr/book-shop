



const test = async () =>{
    const userName = 'tzipi';
    const email = 'tz.s5q310@gmail.com';
    const password = '1234567';


    try{
        const res = await fetch('/users/signUp', {
            method: 'POST',
            body: JSON.stringify({ userName, email , password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if(res.status === 409){
            throw new Error('the email is already exists')
        }

        console.log(await res.json())

    }catch(e){
        console.log("Sign up error:", e);
    }
}
console.log('test');
test();



