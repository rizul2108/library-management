
form.addEventListener("submit", () => {

	const register = {
		username: username.value,
		password: password.value,
	};

	async function gh() {
		const response = await fetch("/login", {
			method: "POST",
			body: JSON.stringify(register),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		if (data.status == "error") {
			const err = document.getElementById("err");
			const suc = document.getElementById("suc");
			err.style.display = "block";
			suc.style.display = "none";
			err.innerText = data.error;
		}
	}
	// module.exports=register.username;

	gh();
});
