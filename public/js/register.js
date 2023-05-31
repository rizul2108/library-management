form.addEventListener("submit",()=>{
    const register={
        username:username.value,
        password:password.value,
        fullname:fullname.value,
        type:type.value,
        passwordC:passwordC.value
    }
console.log(register);
    fetch("/api/register",{
        method:"POST",
        body:JSON.stringify(register),
        headers:{
            "Content-Type":"application/json"
        }})
        .then(res=>res.json())
        .then(
            data=>{
                if(data.status=="error"){
                    error.style.display="block"
                    success.style.display="none"
                    error.innerText=data.error
                }
            }
        )
    
})