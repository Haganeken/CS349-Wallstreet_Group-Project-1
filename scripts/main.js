var DETAIL_IMAGE_SELECTOR = "[data-image-role=\"target\"]";
var DETAIL_TITLE_SELECTOR = "[data-image-role=\"title\"]";
var DETAIL_FRAME_SELECTOR = "[data-image-role=\"frame\"]";
var DETAIL_ARROW_SELECTOR = "[data-image-role=\"arrow\"]";
var THUMBNAIL_LINK_SELECTOR = "[data-image-role=\"trigger\"]";
var HIDDEN_DETAIL_CLASS = "hidden-detail";
var TINY_EFFECT_CLASS = "is-tiny";
var ESC_KEY = 27;
var DETAIL_IMAGE_INDEX = 0;


function hideDetails() {
  "use strict";
  document.body.classList.add(HIDDEN_DETAIL_CLASS);
}

function showDetails() {
  "use strict";
  var frame = document.querySelector(DETAIL_FRAME_SELECTOR);
  document.body.classList.remove(HIDDEN_DETAIL_CLASS);
  frame.classList.add(TINY_EFFECT_CLASS);
  setTimeout(function() {
    frame.classList.remove(TINY_EFFECT_CLASS);
  }, 50);
}

function addKeyPressHandler() {
  "use strict";
  document.body.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ESC_KEY) {
      hideDetails();
    }
  });
}

function setDetails(imageUrl, titleText) {
  "use strict";
  var detailImage = document.querySelector(DETAIL_IMAGE_SELECTOR);
  detailImage.setAttribute("src", imageUrl);

  var detailTitle = document.querySelector(DETAIL_TITLE_SELECTOR);
  detailTitle.textContent = titleText;
}

function imageFromThumb(thumbnail) {
  "use strict";
  return thumbnail.getAttribute("data-image-url");
}

function titleFromThumb(thumbnail) {
  "use strict";
  return thumbnail.getAttribute("data-image-title");
}

function setDetailsFromThumb(thumbnail) {
  "use strict";
  DETAIL_IMAGE_INDEX = thumbnail.getAttribute("data-image-index");
  setDetails(imageFromThumb(thumbnail), titleFromThumb(thumbnail));
}

function getThumbnailsArray() {
  "use strict";
  var thumbnails = document.querySelectorAll(THUMBNAIL_LINK_SELECTOR);
  var thumbnailArray = [].slice.call(thumbnails);
  return thumbnailArray;
}

function getArrowsArray() {
  "use strict";
  var arrows = document.querySelectorAll(DETAIL_ARROW_SELECTOR);
  var arrowArray = [].slice.call(arrows);
  return arrowArray;
}

function addThumbClickHandler(thumb) {
  "use strict";
  thumb.addEventListener("click", function(event) {
    event.preventDefault();
    setDetailsFromThumb(thumb);
    showDetails();
  });
}

function addArrowClickHandler(arrow) {
  "use strict";
  arrow.addEventListener("click", function() {
    var thumb = getThumbnailFromIndex(arrow);
    setDetailsFromThumb(thumb);
  });
}

function getThumbnailFromIndex(arrow) {
  "use strict";
  var direction = arrow.getAttribute("data-image-arrow");
  if (direction == "left") {
    DETAIL_IMAGE_INDEX--;
  } else {
    DETAIL_IMAGE_INDEX++;
  }

  if (DETAIL_IMAGE_INDEX > 4) {
    DETAIL_IMAGE_INDEX = 0;
  } else if (DETAIL_IMAGE_INDEX < 0) {
    DETAIL_IMAGE_INDEX = 4;
  }

  return document.querySelector("[data-image-index=\"" + DETAIL_IMAGE_INDEX + "\"]");
}

function initializeEvents() {
  "use strict";
  var thumbnails = getThumbnailsArray();
  var arrows = getArrowsArray();
  thumbnails.forEach(addThumbClickHandler);
  arrows.forEach(addArrowClickHandler);
  addKeyPressHandler();
}

initializeEvents();
