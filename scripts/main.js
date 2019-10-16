var slider = document.getElementById("ageSlider");
var output = document.getElementById("ageText");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
};