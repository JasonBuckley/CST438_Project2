signUp();

function signUp() {

    var user = new Parse.User();
    user.set("username", "my name");
    user.set("password", "my pass");
    user.set("address", "my address");
    user.set("email", "email@example.com");

    user.signUp().then(function (user) {
        console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function (error) {
        console.log("Error: " + error.code + " " + error.message);
    });



    // creates a frame that holds the info for a product.
	function createFrameDiv(element) {
		<div id ="div1">
			<p id="username" type="text">Username: </p>
		    <span id="correctUser"></span>
			<br>
			<p id="password" type="text">Password:</p> 
			<span id="sugPassword"></span>
				<br>
					<p id="email" type="text">Email:</p>
			<br><br>
		</div>

	document.querySelector('#password').addEventListener('click', async function() {
				let passwordSize = 8;
		let url = `https://itcdland.csumb.edu/~milara/api/suggestedPwd.php?length=${passwordSize}`;

		let data = await fetchData(url);

		document.querySelector('#sugPassword').innerHTML = `Suggested password: ${data.password}`;
	});


	document.querySelector("#username").addEventListener("change", async function(){

				let user = document.querySelector("#username").value;


		let url = `https://cst336.herokuapp.com/projects/api/usernamesAPI.php?username=${user}`;

		let data = await fetchData(url);

		let userVal = `Enter username`;
		if (data.available){
				userVal = 'Available';
		} else {
				userVal = 'Not Available';
		}
		document.querySelector('#correctUser').innerHTML = `This Username is ${userVal}`;
	});


	document.addEventListener('DOMContentLoaded', async function () {
				let data = await fetchData('https://cst336.herokuapp.com/projects/api/state_abbrAPI.php');
		let states = document.querySelector('#state');
		data.forEach(function (stateObject) {
				states.innerHTML += `<option value="${stateObject.state}">${stateObject.state}</option>`;
		});
	});

	async function fetchData(url){

				let response = await fetch(url);
		let data = await response.json();

		return data;
	}
        );


}