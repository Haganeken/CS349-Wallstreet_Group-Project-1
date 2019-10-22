let ADD_CARD_SELECTOR = "#add-card-form";
let CARD_SELECTOR = "[data-card]";
let MODAL_SELECTOR = "[data-modal]";

let App = window.App;
let Formhandler = new App.FormHandler(ADD_CARD_SELECTOR);


$(document).ready(function () {
    initFilterBar();
    Formhandler.addSubmitHandler(uploadFile);
});

let showMore = function () {
    let cardData = $(CARD_SELECTOR);
    let modalData = $(MODAL_SELECTOR);

    modalData[0].src = cardData[0].src;
    modalData[1].innerText = cardData[1].innerText;
    modalData[2].innerText = cardData[2].innerText;
    modalData[3].innerText = cardData[3].innerText;
    modalData[4].innerText = cardData[4].innerText;
    modalData[5].innerText = cardData[5].innerText;
    modalData[6].innerText = cardData[6].innerText;
    modalData[7].innerText = cardData[7].innerText;
    modalData[8].innerText = "getUserEmail";

};

let uploadFile = function (data) {
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