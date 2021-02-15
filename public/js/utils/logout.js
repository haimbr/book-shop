

export const logOut = async () => {
    

    try{
        const res = await fetch('/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        location.reload();
    }catch(e){
        console.log("login error:", e);
    }
}