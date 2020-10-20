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
				<br>
					<p id="email" type="text">Email:</p>
			<br><br>
		</div>

}