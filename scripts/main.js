var slider = document.getElementById("ageSlider");
var output = document.getElementById("ageText");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
};


// When the user scrolls the page, execute myFunction
window.onscroll = function() {toggleSticky()};

// Get the navbar
var navbar = document.getElementById("filterbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function toggleSticky() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

var picker = new Lightpick({
    field: document.getElementById('demo-11_1'),
    secondField: document.getElementById('demo-11_2'),
    repick: true,
    startDate: moment().startOf('month').add(7, 'day'),
    endDate: moment().add(1, 'month').endOf('month').subtract(7, 'day')
});
