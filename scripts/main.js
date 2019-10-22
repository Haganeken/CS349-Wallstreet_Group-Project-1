let ADD_CARD_SELECTOR = "#add-card";

let App = window.App;
let Formhandler = new App.FormHandler(ADD_CARD_SELECTOR);

Formhandler.addSubmitHandler(uploadFile);

$(document).ready(function () {
    initFilterBar();
});

function uploadFile(data) {
    console.log(data); // Form info
    var blobFile = document.getElementById('image').files[0];
    console.log(blobFile); // File info
    data.image(blobFile);

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
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        let $uploadedImage = $('#uploadedImage');
        reader.onload = function (e) {
            $uploadedImage.attr('src', e.target.result);
            $uploadedImage.removeClass("d-none");
        };
        reader.readAsDataURL(input.files[0]);
    }
}