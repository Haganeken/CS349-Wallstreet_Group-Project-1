/**
 * Registers user in DB
 * @param {object} data Data with fields: [email, password, passwordCheck]
 */
function registerUser(data) {
    let $response = $(REGISTER_RESPONSE_SELECTOR);
    if (data.password !== data.passwordCheck) {
        $response.text("Passwords don't match!");
    } else if (userDS.emailMap[data.email]) {
        $response.text("Email already in use");
    } else {
        delete data.passwordCheck;
        userDS.add(data.email, data);
        $(REGISTER_MODAL_SELECTOR).modal('hide');
        toggleLogin(data.email);
    }
}

/**
 * Authenticates a user and changes UI accordingly
 * @param {object} data Data with fields: [email, password]
 */
function authUser(data) {
    let id = userDS.emailMap[data.email];
    let $response = $(LOGIN_RESPONSE_SELECTOR);

    if (!id) {
        $response.text("User not found or password is incorrect");
        return
    }
    userDS.get(data.email, function (response) {
        if ((!response) || (response.password !== data.password)) {
            $response.text('User not found or password is incorrect');
        } else {
            $response.text(null);
            $(LOGIN_MODAL_SELECTOR).modal('hide');
            toggleLogin(data.email);
        }
    })
}

/**
 * Toggles login state dependant on current state
 * @param {string} email User email
 */
function toggleLogin(email) {
    if (userLoggedIn) {
        $(LOGIN_NAV_CONTAINER_SELECTOR).show();
        $(SIGNOUT_NAV_CONTAINER_SELECTOR).hide();
        currentUser = null;
        hideEditButtons();
    } else {
        $(LOGIN_NAV_CONTAINER_SELECTOR).hide();
        $(SIGNOUT_NAV_CONTAINER_SELECTOR).show();
        currentUser = email;
        $(WELCOME_MESSAGE_SELECTOR).text(currentUser);
        displayEditButtons();
    }
    userLoggedIn = !userLoggedIn;
}
