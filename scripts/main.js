// Constants
let ADD_CARD_SELECTOR = "#add-card-form";
let LOGIN_SELECTOR = "#login-form";
let REGISTER_SELECTOR = "#register-form";
let CARD_SELECTOR = "[data-card]";
let MODAL_SELECTOR = "[data-modal]";
let USER_SERVER_URL = "http://localhost:2403/users";
let CARD_SERVER_URL = "http://localhost:2403/cards";

// Init
let App = window.App;
let Formhandler = App.FormHandler;
let RemoteDataStore = App.RemoteDataStore;

let userDS = new RemoteDataStore(USER_SERVER_URL);
let cardDS = new RemoteDataStore(CARD_SERVER_URL);
let cardForm = new Formhandler(ADD_CARD_SELECTOR);
let loginForm = new Formhandler(LOGIN_SELECTOR);
let registerForm = new Formhandler(REGISTER_SELECTOR);


var cards = [];

$(document).ready(function () {
    $("#signout-button").hide();

    initFilterBar();

    cardForm.addSubmitHandler(uploadCard);
    loginForm.addSubmitHandler(authUser);
    registerForm.addSubmitHandler(registerUser);

    // Populate cards on init
    cardDS.getAll(function (response) {
        response.forEach(function (item) {
            cardDS.emailMap[item.emailAddress] = item.id;
            cardDS.idMap[item.id] = item.emailAddress;
            item.date = item.date.substring(0, 10);
            cards = cards.concat(item);
            addCard(item);
        })
    });

    userDS.getAll(function (response) {
        response.forEach(function (item) {
            userDS.emailMap[item.email] = item.id;
            userDS.idMap[item.id] = item.email;
        })
    });
});

/*
* Adds card from form data
 */
function addCard(data) {
    var $card = $("<div></div>", {
        "id": cardDS.emailMap[data.emailAddress],
        "class": "card col-md-3"
    });

    var $img = $("<img></img>", {
        "class": "card-image",
        "data-card": "image",
        "src": "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/2560x1280/landscape-1500925839-golden-retriever-puppy.jpg?resize=480:*"
    });
    $card.append($img);

    var $cardBody = $("<div></div>", {
        "class": "card-body"
    });

    var $title = $("<h5></h5>", {
        "class": "card-title"
    });

    var $titleName = $("<span></span>", {
        "data-card": "name"
    });
    $titleName.append(data.name);
    $title.append($titleName);
    $title.append(", ");

    var $age = $("<span></span>", {
        "data-card": "age"
    });
    $age.append(data.age);

    $title.append($age);
    $title.append(" years");

    $cardBody.append($title);

    var $breed = $("<p></p>", {
        "data-card": "breed",
        "class": "font-italic font-weight-light"
    });
    $breed.append(data.breed);
    $cardBody.append($breed);

    var $description = $("<p></p>", {
        "data-card": "description",
        "class": "card-desc"
    });
    $description.append(data.details);
    $cardBody.append($description);

    var $grid = $("<div></div>", {
        "class": "card-grid"
    });

    var $iconDate = $("<i></i>", {
        "class": "fa fa-calendar"
    });
    var $gridDate = $("<a></a>", {
        "class": "card-date card-grid-wide"
    });
    var $spanDate = $("<span></span>", {
        "class": "nav-text",
        "data-card": "date"
    });
    $spanDate.append(data.date);
    $gridDate.append($spanDate);
    $grid.append($iconDate);
    $grid.append($gridDate);

    var $iconTime = $("<i></i>", {
        "class": "fa fa-bell"
    });
    var $gridTime = $("<a></a>", {
        "class": "card-date card-grid-wide"
    });
    var $spanTime = $("<span></span>", {
        "class": "nav-text",
        "data-card": "time"
    });
    $spanTime.append(data.time);
    $gridTime.append($spanTime);
    $grid.append($iconTime);
    $grid.append($gridTime);

    var $iconLoc = $("<i></i>", {
        "class": "fa fa-thumb-tack"
    });
    var $gridLoc = $("<a></a>", {
        "class": "card-date card-grid-wide"
    });
    var $spanLoc = $("<span></span>", {
        "class": "nav-text",
        "data-card": "location"
    });
    $spanLoc.append(data.location);
    $gridLoc.append($spanLoc);
    $grid.append($iconLoc);
    $grid.append($gridLoc);

    var $button = $("<button></button>", {
        "class": "btn btn-primary btn-more",
        "data-target": "#more-modal",
        "data-toggle": "modal",
        "onclick": "showMore(this)",
        "type": "button"
    });

    $button.append("See more");

    $cardBody.append($grid);
    $cardBody.append($button);
    $card.append($cardBody);
    $("#container-card").append($card);
}

/*
* Registers user in DB
 */
let registerUser = function (data) {
    if (data.password !== data.passwordCheck) {
        alert("Passwords don't match!");
    } else {
        delete data.passwordCheck;
        userDS.add(data.email, data);
        alert('User added successfully');
        $("#register-modal").modal('hide');
        $("#login-button").hide();
        $('#signout-button').show();
    }
};

/*
* Signs user out
 */
let signOut = function () {
    $("#signout-button").hide();
    $("#login-button").show();
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
            alert('Logged in');
            $("#login-modal").modal('hide');
            $("#login-button").hide();
            $('#signout-button').show();
        }
    })
};

/*
* Filters the cards by date
 */
let filterDate = function (t1, t2) {
    var date1 = Date.parse(t1._d.getFullYear().toString() + "-" +
        (t1._d.getMonth() + 1).toString() + "-" +
        t1._d.getDate());
    var date2 = Date.parse(t2._d.getFullYear().toString() + "-" +
        (t2._d.getMonth() + 1).toString() + "-" +
        t2._d.getDate());

    cards.forEach(function (item) {
        var itemDate = Date.parse(item.date);

        if ((itemDate < date1) || (itemDate > date2)) {
            $("#" + item.id).hide();
        } else {
            $("#" + item.id).show();
        }
    });
};

/*
* Filters the cards by age
 */
let filterAge = function (age) {
    cards.forEach(function (item) {
        if (item.age < age) {
            $("#" + item.id).hide();
        } else {
            $("#" + item.id).show();
        }
    });
};

/*
* Filters the cards by time
 */
let filterTime = function (t1, t2) {
    cards.forEach(function (item) {
        if ((item.time.substr(0, 2) < t1) || (item.time.substr(0, 2) > t2)) {
            $("#" + item.id).hide();
        } else {
            $("#" + item.id).show();
        }
    });
};

/*
* Uploads a card to the server
* @param data The data from the form
 */
let uploadCard = function (data) {
    var blobFile = document.getElementById('image').files[0];
    data.image = blobFile;

    cardDS.add(data.emailAddress, data, function () {
        addCard(data);
    });
};

/*
* Moves data from cards to modal
* @param element The see more button.
 */
let showMore = function (element) {
    let id = element.parentElement.parentElement.id;
    let cardData = $("#" + id + " " + CARD_SELECTOR);
    let modalData = $(MODAL_SELECTOR);

    // modalData[0].src = cardData[0].src;
    modalData[1].innerText = cardData[1].innerText;
    modalData[2].innerText = cardData[2].innerText;
    modalData[3].innerText = cardData[3].innerText;
    modalData[4].innerText = cardData[4].innerText;
    modalData[5].innerText = cardData[5].innerText;
    modalData[6].innerText = cardData[6].innerText;
    modalData[7].innerText = cardData[7].innerText;
    let email = cardDS.idMap[id];
    modalData[8].innerText = email;

    $("#contact-btn").attr("href", "mailto:" + email +
        "?subject=Dog-date appointment&body=Hello, let's arrange a dog-date!");
};

/*
* Displays the chosen image when adding a card
* @param input The input element in the DOM
 */
let readURL = function (input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        let $uploadedImage = $('#uploadedImage');
        reader.onload = function (e) {
            $uploadedImage.attr('src', e.target.result);
            $uploadedImage.removeClass("d-none");
        };
        reader.readAsDataURL(input.files[0]);
    }
};