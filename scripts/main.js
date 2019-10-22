$(document).ready(function () {
    initFilterBar();
});

$('#image').change(function () {
    readURL(this);
});

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