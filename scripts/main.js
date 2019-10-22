// Constants
let ADD_CARD_SELECTOR = "#add-card-form";
let CARD_SELECTOR = "[data-card]";
let MODAL_SELECTOR = "[data-modal]";

// Init
let App = window.App;
let Formhandler = new App.FormHandler(ADD_CARD_SELECTOR);

$(document).ready(function () {
    initFilterBar();
    Formhandler.addSubmitHandler(uploadForm);
});

/*
*
* @param
 */

/*
* Moves data from cards to modal
* @param element The see more button.
 */
let showMore = function (element) {
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
    let email = "getUserEmail";
    modalData[8].innerText = email;

    $("#contact-btn").attr("href", "mailto:" + email +
        "?subject=Dog-date appointment&body=Hello, let's arrange a dog-date!");

};

/*
* Uploads a card to the server
* @param data The data from the form
 */
let uploadForm = function (data) {
    console.log(data); // Form info
    var blobFile = document.getElementById('image').files[0];
    console.log(blobFile); // File info
    data.image = blobFile;
    console.log(data); // Form info


    // $.ajax({
    //     url: "upload.php",
    //     type: "POST",
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     success: function(response) {
    //         // .. do something
    //     },
    //     error: function(jqXHR, textStatus, errorMessage) {
    //         console.log(errorMessage); // Optional
    //     }
    // });
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