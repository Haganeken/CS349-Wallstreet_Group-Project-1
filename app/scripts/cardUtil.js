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

function addEditButton(card) {
    let $card = $('#' + card.id);
    let $icon = $("<i></i>", {
        "class": "fas fa-pencil-alt edit-icon"
    });
    let $text = $("<p></p>", {
        "class": "edit-text"
    });
    let $bar = $("<button></button>", {
        "class": "edit-bar",
        "type": "button",
        "onclick": "editCardModal(this)"
    });
    $text.append("Edit");
    $bar.append($icon);
    $bar.append($text);
    $card.append($bar);
}

function editCardModal(card) {
    let $cardModal = $("#card-modal .form-group");
    $("#image").attr('required', false);

    let $buttons = $("#card-modal .modal-footer");
    let $deletebtn = $("<button></button>", {
        "id": "deleteBtn",
        "class": "btn btn-secondary",
        "type": "submit",
        "onclick": "removeCard()"
    });
    $deletebtn.text("Delete");
    $buttons.prepend($deletebtn);

    $buttons.children()[1].innerHTML = "Discard Changes";
    $buttons.children()[2].innerHTML = "Save Changes";

    let cardId = card.parentElement.id;
    $("#submit").data().cardId = cardId;

    cardDS.get(cardId, function (response) {
        $(UPLOADED_IMAGE_SELECTOR).attr('src', response.image);
        $cardModal[0].children[1].value = response.name;
        $cardModal[1].children[1].value = response.age;
        $cardModal[2].children[1].value = response.breed;
        $cardModal[3].children[1].value = response.details;
        var time = new Date(response.date);
        $cardModal[4].children[1].value = time.customFormat("#YYYY#-#MM#-#DD#");
        $cardModal[5].children[1].value = response.time;
        $cardModal[6].children[1].value = response.location;

        response.latlng['lat'] = Number(response.latlng['lat']);
        response.latlng['lng'] = Number(response.latlng['lng']);

        map.moveMarker(response.latlng);

        $("#card-modal").modal('show');
    });
}

function displayEditButtons() {
    $(CARDS_SELECTOR).each(function (index, card) {
        if (cardDS.idMap[card.id] === currentUser) {
            addEditButton(card);
        }
    })
}

function hideEditButtons() {
    $(".edit-bar").remove();
}

function uploadCard(data) {
    data.emailAddress = currentUser;

    cardDS.add(data.emailAddress, data, function () {
        addCard(data);
        cards.concat(data);
        filterCards();
    });
}

function removeCard() {
    let cardId = $("#submit").data().cardId;
    cardDS.remove(cardId);
    $("#" + cardId).remove();
}

function editCard(data) {
    cardDS.update(data.cardId, data, function (response) {
        let cardData = $("#" + response.id + " " + CARD_DATA_SELECTOR);

        cardData[0].src = response.image;
        cardData[1].innerHTML = response.name;
        cardData[2].innerHTML = response.age;
        cardData[3].innerHTML = response.breed;
        cardData[4].innerHTML = response.details;
        var time = new Date(response.date);
        cardData[5].innerHTML = time.customFormat("#YYYY#-#MM#-#DD#");
        cardData[6].innerHTML = response.time;
        cardData[7].innerHTML = response.location;
        response.latlng['lat'] = Number(response.latlng['lat']);
        response.latlng['lng'] = Number(response.latlng['lng']);
        cardData[8].innerHTML = getDistance(user_location, response.latlng).toPrecision(2) + " km";
    })
}

function resetCardModal() {
    let $cardModal = $("#card-modal .form-group");
    $(UPLOADED_IMAGE_SELECTOR).attr('src', 'img/placeholder.jpg');
    $cardModal[0].children[1].value = "";
    $cardModal[1].children[1].value = "";
    $cardModal[2].children[1].value = "";
    $cardModal[3].children[1].value = "";
    $cardModal[4].children[1].value = "";
    $cardModal[5].children[1].value = "";
    $cardModal[6].children[1].value = "";

    map.moveMarker(user_location);
    map.deleteMarker();
}


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
        "data-card": "distance"
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