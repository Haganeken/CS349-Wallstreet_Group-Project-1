/*
* Initializes the sub-components of the filter bar
*/
function initFilterBar() {
    initAgeSlider();
    initTimeSlider();
    initStickyFilter();
    initDropdown();
    initLocationCheckboxes();
    initDateFilter();
}

/*
* Stops the dropdown from disappearing when clicking inside the dropdown menu
*/
let initDropdown = function () {
    $('.dropdown-menu').on("click.bs.dropdown", function (event) {
        event.stopPropagation();
        // event.preventDefault();
    });
};

/*
* Adds a click event to all location filters
*/
let initLocationCheckboxes = function () {
    var checkboxes = $(".btn-group-toggle label input");
    checkboxes.click(function (event) {
        $('label.btn.tag-btn.btn-lg').each(function () {
            this.setAttribute("style", "");
        });
        checkboxClick(event);
    });
};

/*
* Adds color to the selected location filter
*/
var checkboxClick = function (event) {
    var target = event.currentTarget;
    let parent = target.parentElement;

    parent.setAttribute("style", "background-color: var(--color-dark-red)");
    //DO stuff

    console.log(target.value);

};

/*
* Updates values when dragging the age slider
*/
let initAgeSlider = function () {
    let slider = document.getElementById("ageSlider");
    let output = document.getElementById("ageButtonText");

    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value
    slider.oninput = function () {
        output.innerHTML = this.value;
    };
};

/*
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
        values: [12, 18],
        slide: function (event, ui) {
            $timeText.val(ui.values[0] + ":00 - " + ui.values[1] + ":00");
            $timeButtonText.text($timeText.val());
        }
    });

    $timeText.val($timeSlider.slider("values", 0) +
        ":00 - " + $timeSlider.slider("values", 1) + ":00");
    $timeButtonText.text($timeText.val());
};

/*
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

/*
* Initializes the date picker
*/
let initDateFilter = function () {
    var picker = new Lightpick({
        field: document.getElementById('date-from'),
        secondField: document.getElementById('date-to'),
        repick: true,
        startDate: moment().startOf('month').add(7, 'day'),
        endDate: moment().endOf('month').subtract(7, 'day')
    });
};