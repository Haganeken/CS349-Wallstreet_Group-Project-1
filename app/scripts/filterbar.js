/**
* Initializes the sub-components of the filter bar
*/
function initFilterBar() {
    initAgeSlider();
    initTimeSlider();
    initStickyFilter();
    initDropdown();
    initDistanceSlider();
    initDateFilter();
}

/*
* Filter variables
*/
var date_start = "2000/01/01";
var date_end = "2030/01/01";
var age = 1;
var time_start = 0;
var time_end = 23;
var user_location;
var range = 100;
var cardsVisible;

/**
 * Uses the 'haversine' formula to calculate the great-circle distance between two points.
 * @param {object} coord1 First coordinates with fields: 'lat' and 'lng' and integer values
 * @param {object} coord2 Second coordinates with fields: 'lat' and 'lng' and integer values
 * @returns {number} Distance in kilometers
 */
let getDistance = function (coord1, coord2) {
    var R = 6371; // kilometres
    var lat1 = coord1['lat'] * Math.PI / 180;
    var lat2 = coord2['lat'] * Math.PI / 180;
    var dLat = (lat2 - lat1) * Math.PI / 180; //delta in latitude
    var dLon = (coord2['lng'] - coord1['lng']) * Math.PI / 180;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
};

/**
 * Checks if card is in range of user
 * @param {object} coords Coordinates with fields: 'lat' and 'lng' and integer values
 * @returns {boolean} True if user is in range of the coordinates
 */
let isInRange = function (coords) {
    return getDistance(coords, user_location) < range;
};

/**
 * Filters cards by hiding or showing them. Checks all available filters. Displays message if filter is too strict.
 */
let filterCards = function () {
    cards.forEach(function (item) {
        let longItemDate = Date.parse(item.date);
        let longDate1 = Date.parse(date_start);
        let longDate2 = Date.parse(date_end);
        let card = $("#" + item.id);

        if ((longItemDate < longDate1) ||
            (longItemDate > longDate2) ||
            (item.age < age) ||
            ((item.time.substr(0, 2) < time_start) || (item.time.substr(0, 2) > time_end)) ||
            (!isInRange(item.latlng))) {
            if (card[0].style.display !== "none") {
                card.hide();
                cardsVisible--;
            }
        } else {
            if (card[0].style.display === "none") {
                card.show();
                cardsVisible++;
            }
        }
    });

    let containerCard = $(CONTAINER_CARD_SELECTOR);
    if (cardsVisible === 0) {
        if (!$(".container-card > p")[0]) {
            containerCard.append("<p> No cards to display... </p>");
        }
    } else {
        $(".container-card > p").remove();
    }
};


/**
 * Filters cards by date
 * @param {object} start Moment object
 * @param {object} end Moment object
 */
let filterDate = function (start, end) {
    date_start = start.format('YYYY-MM-DD');
    date_end = end.format('YYYY-MM-DD');

    filterCards();

    let str = '';
    str += date_start ? date_start + ' to ' : '';
    str += date_end ? date_end : '...';
    document.getElementById('date-filter').value = str;
};

/**
 * Filters cards by age
 * @param {number} val Age value
 */
let filterAge = function (val) {
    age = val;
    filterCards();
};

/**
 * Filters cards by time
 * @param {number} t1 Time in hours (HH)
 * @param {number} t2 Time in hours (HH)
 */
let filterTime = function (t1, t2) {
    time_start = t1;
    time_end = t2;
    filterCards();
};

/**
 * Adds color to the selected location filter
 * @param {number} val Range in kilometers
 */
let filterDistance = function (val) {
    range = val;
    filterCards();
};

/**
 * Stops the dropdown from disappearing when clicking inside the dropdown menu
 */
let initDropdown = function () {
    $('.dropdown-menu').on("click.bs.dropdown", function (event) {
        event.stopPropagation();
        // event.preventDefault();
    });
    $('.form-control').on("click.bs.dropdown", function (event) {
        event.stopPropagation();
        // event.preventDefault();
    });
};

/**
 * Adds a click event to all location filters
 */
let initDistanceSlider = function () {
    let slider = document.getElementById("distanceSlider");
    let output = document.getElementById("distanceText");

    // Update the current slider value
    slider.oninput = function () {
        output.innerHTML = "<" + this.value + " km";
        filterDistance(this.value);
    };
};

/**
 * Updates values when dragging the age slider
 */
let initAgeSlider = function () {
    let slider = document.getElementById("ageSlider");
    let output = document.getElementById("ageButtonText");

    // Update the current slider value
    slider.oninput = function () {
        output.innerHTML = "&#8805 " + this.value;
        filterAge(this.value);
    };
};

/**
 * Initializes the time range-slider and updates values when dragging the range-slider
 */
let initTimeSlider = function () {
    let $timeSlider = $("#timeSlider");
    let $timeText = $("#timeText");
    let $timeButtonText = $("#timeButtonText");

    $timeSlider.slider({
        range: true,
        min: 0,
        max: 23,
        values: [1, 23],
        slide: function (event, ui) {
            $timeText.val(ui.values[0] + ":00 - " + ui.values[1] + ":00");
            $timeButtonText.text($timeText.val());
            filterTime(ui.values[0], ui.values[1]);
        }
    });
};

/**
 * Initializes the date picker
 */
let initDateFilter = function () {
    let dateFilter = $(DATE_FILTER_SELECTOR);

    var picker = new Lightpick({
        field: dateFilter[0],
        repick: true,
        singleDate: false,
        onSelect: function (start, end) {
            filterDate(start, end);
        }
    });

    dateFilter.val("Date");
};

/**
 * Sticks the filterbar to the top when scrolled out of view
 */
let initStickyFilter = function () {
    window.onscroll = function () {
        toggleSticky()
    };

    let filterBar = document.getElementById("filterbar");
    let cardContainer = document.getElementById("container-card");
    // Get the offset position of the
    var sticky = filterBar.offsetTop;

    // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function toggleSticky() {
        if (window.pageYOffset >= sticky) {
            filterBar.classList.add("sticky-top");
            cardContainer.classList.add("mt-5");
        } else {
            filterBar.classList.remove("sticky-top");
            cardContainer.classList.remove("mt-5");
        }
    }
};
