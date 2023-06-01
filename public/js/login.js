console.log("hi")
function hi(){
console.log("j")
}
form.addEventListener("submit", () => {
    console.log("hi")

	const register = {
		username: username.value,
		password: password.value,
	};

	async function gh() {
		console.log("hi");
		const response = await fetch("/login", {
			method: "POST",
			body: JSON.stringify(register),
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("response");
		const data = await response.json();
		console.log(data);
		if (data.status == "error") {
			const err = document.getElementById("err");
			const suc = document.getElementById("suc");
			err.style.display = "block";
			suc.style.display = "none";
			err.innerText = "data.error";
		}
	}
	// module.exports=register.username;

	gh();
});
