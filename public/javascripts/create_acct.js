signUp();

function signUp() {

    var user = new Parse.User();
    user.set("username", "my name");
    user.set("password", "my pass");
    user.set("email", "email@example.com");

    user.signUp().then(function (user) {
        console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function (error) {
        console.log("Error: " + error.code + " " + error.message);
    });
}