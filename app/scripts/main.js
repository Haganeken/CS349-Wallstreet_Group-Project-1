// Constants
let ADD_CARD_SELECTOR = "#add-card-form";
let LOGIN_SELECTOR = "#login-form";
let REGISTER_SELECTOR = "#register-form";
let CARD_DATA_SELECTOR = "[data-card]";
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
let CARDS_SELECTOR = ".card";
let WELCOME_MESSAGE_SELECTOR = '#currentUser';


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

/**
 * Initializes website when elements are loaded
 */
$(document).ready(function () {
    $(SIGNOUT_NAV_CONTAINER_SELECTOR).hide();

    initFilterBar();
    initSortCheckboxes();

    cardForm.addSubmitHandler(getSubmitAction);
    loginForm.addSubmitHandler(authUser);
    registerForm.addSubmitHandler(registerUser);

    // Populate cards on init
    cardDS.getAll(function (response) {
        getUserLocation(function () {
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
    });

    // Get users on init
    userDS.getAll(function (response) {
        response.forEach(function (item) {
            userDS.emailMap[item.email] = item.id;
            userDS.idMap[item.id] = item.email;
        })
    });

    // Reset card modal when hidden
    $("#card-modal").on('hidden.bs.modal', function () {
        let $buttons = $("#card-modal .modal-footer");
        $("#deleteBtn").remove();
        $("#image").attr('required', true);

        $buttons.children()[0].innerHTML = "Close";
        $buttons.children()[1].innerHTML = "Create Event";
    })
});

/**
 * Converts a time string to float
 * @param {string} time Time in format HH:MM
 */
function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
}

/**
 * Sorts cards by given values from the sort bar
 * @param {string} by Value to be sorted by
 * @param {string} order 'Asc' or 'Desc' order
 */
function sortCards(by, order) {
    $(CONTAINER_CARD_SELECTOR).empty();

    var sortCards = cards;
    if (by === "Date") {
        sortCards = sortCards.sort((item1, item2) => {
            let sortVal = Date.parse(item1.date) - Date.parse(item2.date);
            return order === "Desc" ? -sortVal : sortVal;
        });
    } else if (by === "Distance") {
        sortCards = sortCards.sort((item1, item2) => {
            let sortVal = getDistance(user_location, item1.latlng) - getDistance(user_location, item2.latlng);
            return order === "Desc" ? -sortVal : sortVal;
        });
    } else if (by === "Time") {
        sortCards = sortCards.sort((item1, item2) => {
            let sortVal = timeStringToFloat(item1.time) - timeStringToFloat(item2.time);
            return order === "Desc" ? -sortVal : sortVal;

        });
    } else if (by === "Age") {
        sortCards = sortCards.sort((item1, item2) => {
            let sortVal = item1.age - item2.age;
            return order === "Desc" ? -sortVal : sortVal;
        });
    }

    sortCards.forEach(data => addCard(data));
}

/**
 * Highlights selected variable and calls sortCards(by, order) with currently displayed values.
 * @param {event} event ClickEvent
 */
function getSortVariables(event) {
    var target = event.currentTarget;
    let parent = target.parentElement;
    parent.setAttribute("style", "background-color: var(--color-dark-red)");

    var by = $("#sortByText").text();
    var order = $("#sortTypeText").text();

    sortCards(by, order);
}

/**
 * Initializes event listeners on dropdown menu clicks
 */
function initSortCheckboxes() {
    var checkboxesSort = $("#sortByDropdown label input");
    var checkboxesType = $("#sortTypeDropdown label input");

    checkboxesSort.click(function (event) {
        $('#sortByDropdown label.btn.tag-btn.btn-lg').each(function () {
            this.setAttribute("style", "");
        });

        $("#sortByText").text(event.target.value);
        getSortVariables(event);
    });

    checkboxesType.click(function (event) {
        $('#sortTypeDropdown label.btn.tag-btn.btn-lg').each(function () {
            this.setAttribute("style", "");
        });

        $("#sortTypeText").text(event.target.value);
        getSortVariables(event);
    });
}


/**
 * Uploads a card to the server
 * @param {object} data Form data with fields: [age, breed, date, details, location, name, time]
 */
let getSubmitAction = function (data) {
    let $submitBtn = $("#submit");
    let btnText = $submitBtn.text();
    let image = $(UPLOADED_IMAGE_SELECTOR);

    data.image = image.attr('src');
    data.cardId = $submitBtn.data().cardId;

    image.attr('src', 'img/placeholder.jpg');

    let address = "address=" + encodeURI(data.location);
    getAddressCoordinates(address, function (latlng) {
        data.latlng = latlng;
        if (btnText === "Create Event") {
            uploadCard(data);
        } else if (btnText === "Save Changes") {
            updateCard(data);
        }
    });
    $("#card-modal").modal('hide');
};


/**
 * Opens the add card form if the user is logged in
 */
let openCardForm = function () {
    if (!userLoggedIn) {
        alert("You have to be logged in to add a card!");
        return;
    }
    resetCardModal();
    $("#card-modal").modal('show');
};

/**
 * Opens more-modal and moves data from cards to the modal, if the user is logged in
 * @param {element} element The see more button
 */
let showMore = function (element) {
    if (!userLoggedIn) {
        alert("You have to be logged in to see more!");
        return;
    }
    $("#more-modal").modal('show');

    let id = element.parentElement.parentElement.id;
    let cardData = $("#" + id + " " + CARD_DATA_SELECTOR);
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

// Thank you Gavin

//*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
Date.prototype.customFormat = function (formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = this.getDate() + 1) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = this.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    hhhh = hhh < 10 ? ('0' + hhh) : hhh;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};