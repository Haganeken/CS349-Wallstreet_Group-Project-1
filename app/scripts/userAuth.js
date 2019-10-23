
/*
* Registers user in DB
 */
let registerUser = function (data) {
    if (data.password !== data.passwordCheck) {
        alert("Passwords don't match!");
    } else if (userDS.emailMap[data.email]) {
        alert("Email already in use");
    } else {
        delete data.passwordCheck;
        userDS.add(data.email, data);
        $(REGISTER_MODAL_SELECTOR).modal('hide');
        alert('User added successfully');
        toggleLogin(data);
    }
};

/*
* Authenticates a user and changes UI accordingly
 */
let authUser = function (data) {
    let id = userDS.emailMap[data.email];
    if (!id) {
        alert('User not found or password is incorrect');
        return
    }
    userDS.get(data.email, function (response) {
        if ((!response) || (response.password !== data.password)) {
            alert('User not found or password is incorrect');
        } else {
            alert('Logged in successfully');
            $(LOGIN_MODAL_SELECTOR).modal('hide');
            toggleLogin(data);
        }
    })
};

/*
* Toggles login state dependant on current state
 */
let toggleLogin = function (data) {
    if (userLoggedIn) {
        $(LOGIN_NAV_CONTAINER_SELECTOR).show();
        $(SIGNOUT_NAV_CONTAINER_SELECTOR).hide();
        currentUser = null;
    } else {
        $(LOGIN_NAV_CONTAINER_SELECTOR).hide();
        $(SIGNOUT_NAV_CONTAINER_SELECTOR).show();
        currentUser = data.email;
        $('#currentUser').text(currentUser);
    }
    userLoggedIn = !userLoggedIn;
    console.log("user" + currentUser);

};
