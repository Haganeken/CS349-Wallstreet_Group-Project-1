//TODO: Add edit feature, and delete inside edit modal
//TODO: Sort by functionality
//TODO: oauth

// Constants
let ADD_CARD_SELECTOR = "#add-card-form";
let LOGIN_SELECTOR = "#login-form";
let REGISTER_SELECTOR = "#register-form";
let CARD_SELECTOR = "[data-card]";
let MODAL_SELECTOR = "[data-modal]";
let USER_SERVER_URL = "http://localhost:2403/users";
let CARD_SERVER_URL = "http://localhost:2403/cards";
let REGISTER_MODAL_SELECTOR = "#register-modal";
let LOGIN_MODAL_SELECTOR = "#login-modal";
let LOGIN_NAV_CONTAINER_SELECTOR = "#login-nav-container";
let SIGNOUT_NAV_CONTAINER_SELECTOR = '#signout-nav-container';
let MAP_SELECTOR = "#map";
let LOCATION_INPUT_SELECTOR = '#location';
let UPLOADED_IMAGE_SELECTOR = '#uploadedImage';
let DATE_FILTER_SELECTOR = '#date-filter';
let CONTAINER_CARD_SELECTOR = ".container-card";
let LOGIN_RESPONSE_SELECTOR = "#login-response";
let REGISTER_RESPONSE_SELECTOR = "#register-response";
let MODAL_LOCATION_SELECTOR = "[data-modal=location]";


// Variables
var cards = [];
var userLoggedIn = false;
var currentUser = null;

// Init
let App = window.App;
let Formhandler = App.FormHandler;
let RemoteDataStore = App.RemoteDataStore;
let GMap = App.GMap;
let Autocomplete = App.Autocomplete;

let userDS = new RemoteDataStore(USER_SERVER_URL);
let cardDS = new RemoteDataStore(CARD_SERVER_URL);
let cardForm = new Formhandler(ADD_CARD_SELECTOR);
let loginForm = new Formhandler(LOGIN_SELECTOR);
let registerForm = new Formhandler(REGISTER_SELECTOR);
var map;
var autocomplete;

$(document).ready(function () {
    $(SIGNOUT_NAV_CONTAINER_SELECTOR).hide();

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
        });

        cardsVisible = cards.length;
        filterCards();
    });

    // Get users on init
    userDS.getAll(function (response) {
        response.forEach(function (item) {
            userDS.emailMap[item.email] = item.id;
            userDS.idMap[item.id] = item.email;
        })
    });

});


let getAddressFromCoordinates = function (coords, cb) {
    let latlng = "latlng=" + coords['lat'] + "," + coords['lng'];
    let API_KEY = "key=AIzaSyCTLJXDOMiF29v6kSlOxCZZZ2I3cXZJtco";
    let url = "https://maps.googleapis.com/maps/api/geocode/json?" + latlng + "&" + API_KEY;

    $.ajax({
        url: url,
        success: function (data) {
            let address = data.results[0]; // Choose first address in results list
            cb(address);
        }
    });
};

let getDirections = function () {
    var url = "https://www.google.dk/maps/dir/";
    getAddressFromCoordinates(user_location, function (address) {
        url += encodeURI(address.formatted_address);
        url += "/" + encodeURI($(MODAL_LOCATION_SELECTOR).text());
        window.open(url);
    });
};

let getUserLocation = function (cb) {
    navigator.geolocation.getCurrentPosition(function (position) {
        user_location = {"lat": position.coords.latitude, "lng": position.coords.longitude};
        cb()
    }, function (error) {
        alert('Please accept location services in order to use dog-date');
        user_location = null;
    });
};

function initMap() {
    map = new GMap(MAP_SELECTOR);
    autocomplete = new Autocomplete(LOCATION_INPUT_SELECTOR);

    getUserLocation(function () {
        map.initMap();

        map.addEventListener(function (event) {
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            let coords = {lat: latitude, lng: longitude};

            map.moveMarker(coords);

            autocomplete.setAddress(coords);
        });

        autocomplete.autocomplete.bindTo('bounds', map.map);

        autocomplete.addEventListener(function () {
            var place = autocomplete.autocomplete.getPlace();
            var coords = {
                lat: place.geometry.location['lat'](),
                lng: place.geometry.location['lng']()
            };

            map.moveMarker(coords);

            console.log(place);
        });
    });

}

/*
* Uploads a card to the server
* @param data The data from the form
 */
let uploadCard = function (data) {
    let image = $(UPLOADED_IMAGE_SELECTOR);
    data.image = image.attr('src');
    image.attr('src', 'img/placeholder.jpg');

    data.emailAddress = currentUser;

    let address = "address=" + encodeURI(data.location);
    getAddressCoordinates(address, function (latlng) {
        data.latlng = latlng;
        cardDS.add(data.emailAddress, data, function () {
            addCard(data);
            cards.concat(data);
        });
    });

    filterCards();
};

let getAddressCoordinates = function (address, cb) {
    let API_KEY = "key=AIzaSyCTLJXDOMiF29v6kSlOxCZZZ2I3cXZJtco";
    let url = "https://maps.googleapis.com/maps/api/geocode/json?" + address + "&" + API_KEY;
    $.ajax({
        url: url,
        success: function (data) {
            // Choose first matching address
            cb(data.results[0].geometry.location);
        }
    });
};

/*
* Opens the add card form if the user is logged in
 */
let openCardForm = function () {
    if (!userLoggedIn) {
        alert("You have to be logged in to add a card!");
        return;
    }
    $("#card-modal").modal('show');
};

/*
* Opens more-modal and moves data from cards to the modal, if the user is logged in
* @param element The see more button.
 */
let showMore = function (element) {
    if (!userLoggedIn) {
        alert("You have to be logged in to see more!");
        return;
    }
    $("#more-modal").modal('show');

    let id = element.parentElement.parentElement.id;
    let cardData = $("#" + id + " " + CARD_SELECTOR);
    let modalData = $(MODAL_SELECTOR);

    modalData[0].src = cardData[0].src;
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
* Previews the uploaded image when adding a card
* Uses base64 format to store the img
* @param input The input element in the DOM
 */
let previewImage = function (input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        let $uploadedImage = $(UPLOADED_IMAGE_SELECTOR);
        reader.onload = function (e) {
            $uploadedImage.attr('src', e.target.result);
            $uploadedImage.removeClass("d-none");
        };
        reader.readAsDataURL(input.files[0]);
    }
};

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
        "src": data.image
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
        "class": "fas fa-calendar-alt"
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
        "class": "fas fa-clock"
    });
    var $gridTime = $("<a></a>", {
        "class": "card-time card-grid-wide"
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
        "class": "fas fa-map-marker-alt"
    });
    var $gridLoc = $("<a></a>", {
        "class": "card-location card-grid-wide"
    });
    var $spanLoc = $("<span></span>", {
        "class": "nav-text",
        "data-card": "location"
    });
    $spanLoc.append(data.location);
    $gridLoc.append($spanLoc);
    $grid.append($iconLoc);
    $grid.append($gridLoc);

    var $iconDist = $("<i></i>", {
        "class": "fas fa-road"
    });
    var $gridDist = $("<a></a>", {
        "class": "card-distance card-grid-wide"
    });
    var $spanDist = $("<span></span>", {
        "class": "nav-text",
        "data-card": "location"
    });
    $spanDist.append(getDistance(data.latlng, user_location).toPrecision(2) + " km");
    $gridDist.append($spanDist);
    $grid.append($iconDist);
    $grid.append($gridDist);

    var $button = $("<button></button>", {
        "class": "btn btn-primary btn-more",
        // "data-target": "#more-modal",
        // "data-toggle": "modal",
        "onclick": "showMore(this)",
        "type": "button"
    });

    $button.append("See more");

    $cardBody.append($grid);
    $cardBody.append($button);
    $card.append($cardBody);
    $("#container-card").append($card);
}
