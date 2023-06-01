form.addEventListener("submit",()=>{
    const login={
        username:username.value,
        password:password.value,
    }

async function gh(){
    const response = await fetch("/login",{
        method:"POST",
        body:JSON.stringify(login),
        headers:{
            "Content-Type":"application/json"
        }})
        const data=await response.json()
console.log(data);
       if(data.status=="error"){
            const error=document.getElementById("error")
            const success=document.getElementById("success")
            error.style.display="block"
            success.style.display="none"
            error.innerText=data.error
        }
}

gh()})
    