form.addEventListener("submit",()=>{
    const register={
        username:username.value,
        password:password.value,
        fullname:fullname.value,
        type:type.value,
        passwordC:passwordC.value
    }

async function gh(){
    const response = await fetch("/signup",{
        method:"POST",
        body:JSON.stringify(register),
        headers:{
            "Content-Type":"application/json"
        }})
        const data=await response.json()
       if(data.status=="error"){
            const error=document.getElementById("error")
            const success=document.getElementById("success")
            error.style.display="block"
            success.style.display="none"
            error.innerText=data.error
        }
}
// module.exports=register.username;

gh()})
    