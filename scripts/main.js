$(document).ready(function () {
    initAgeSlider();
    initTimeSlider();
    initStickyFilter();
});


let initAgeSlider = function () {
    let slider = document.getElementById("ageSlider");
    let output = document.getElementById("ageText");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value
    slider.oninput = function () {
        output.innerHTML = this.value;
    };
};

let initTimeSlider = function () {
    let $timeSlider = $("#timeSlider");
    $timeSlider.slider({
        range: true,
        min: 0,
        max: 23,
        values: [1, 22],
        slide: function (event, ui) {
            $("#timeText").val(ui.values[0] + ":00 - " + ui.values[1] + ":00");
        }
    });

    $("#timeText").val($timeSlider.slider("values", 0) +
        ":00 - " + $timeSlider.slider("values", 1) + ":00");
};

let initStickyFilter = function () {
    // When the user scrolls the page, execute myFunction
    window.onscroll = function () {
        toggleSticky()
    };

// Get the navbar
    let filterBar = document.getElementById("filterbar");

// Get the offset position of the navbar
    var sticky = filterBar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function toggleSticky() {
        if (window.pageYOffset >= sticky) {
            filterBar.classList.add("sticky")
        } else {
            filterBar.classList.remove("sticky");
        }
    }
};

