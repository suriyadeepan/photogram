/** @format */
window.onload = () => {
  // The dummy class about to be inserted will be removed and replaced
  // by image id at the end of the ajax call
  [...$("button")].forEach((btn, i) => {
    btn.classList.add("dummy");
  });
  // The ajax calls that follow will update the `background-image` css attribute
  // of the image containers
  ["bg", "bg1", "bg2"].forEach((id, i) => {
    requestNextImage(id, i);
  });
};

// The following block executes when anything is clicked in the window
window.onclick = (e) => {
  if (e.target.id == "first-path") {
    requestNextImage("bg", 0);
  } else if (e.target.id == "last-path") {
    requestNextImage("bg2", 1);
  } else if (e.target.id == "second-path") {
    requestNextImage("bg1", 2);
  } else if (e.target.classList.contains("bg-text")) {
    var likeButton = e.target.querySelector("button");
    var fileId = likeButton.classList[likeButton.classList.length - 1];
    console.log(fileId);
    // ajax post
    $.ajax({
      type: "POST",
      url: `/vote/${fileId}`,
      success: (response) => console.log(`AJAX call with ${fileId} success`),
    });
  }
};

// When DOWN or RIGHT arrow keys are pressed the following block executes
// TODO: fix this function
// $(document).keydown(function (e) {
//   if (e.keyCode == 39 || e.keyCode == 40) {
//     console.log("Key pressed");
//     // simulate click event
//     $("#first-path").click();
//   }
// });

// AJAX GET call to fetch the link to the next image in the gdrive folder
var requestNextImage = (bgidx, btnIndex) => {
  $.ajax({
    url: "/next-meta",
    type: "GET",
    success: (data) => {
      image_url = `https://drive.google.com/uc?export=view&id=${data.src}`;
      console.log(image_url);
      $(`#${bgidx}`).css("background-image", `url(${image_url})`);
      // using btnIndex to get the button because
      // $('#bg2 button'), $('#bg1 button'), $('#bg2 button')
      // all return the same element => $('button')[0]
      var likeButton = $("button")[btnIndex];
      // Hijacking the button's class attribute to get the correct file_id
      // for registering votes
      var prev = likeButton.classList[likeButton.classList.length - 1];
      // remove previous id
      likeButton.classList.remove(prev);
      // add new id
      likeButton.classList.add(data.src);
      // get new id
      var attr = likeButton.classList[likeButton.classList.length - 1];
      console.log(`likeButton class added: ${attr}`);
    },
    error: (error) => console.log(`Error ${error}`),
  });
};
