/** @format */

var initMechanisms = () => {
  $(".filter a").click(function (e) {
    e.preventDefault();
    var a = $(this).attr("href");
    a = a.substr(1);
    $(".sets a").each(function () {
      if (!$(this).hasClass(a) && a != "") $(this).addClass("hide");
      else $(this).removeClass("hide");
    });

    // Add active class to the current button (highlight it)
    var btnContainer = document.getElementById("btncontainer");
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
      var current = document.getElementsByClassName("btn-active");
      current[0].className = current[0].className.replace(" btn-active", "");
      this.className += " btn-active";
    }
  });

  let imgs = document.querySelectorAll("img");
  console.log("image list");
  console.log(imgs);
  let count;
  imgs.forEach((img, index) => {
    img.addEventListener("click", function (e) {
      console.log(e.target);
      if (e.target == this) {
        count = index;
        let openDiv = document.createElement("div");
        let imgPreview = document.createElement("img");
        let butonsSection = document.createElement("div");
        butonsSection.classList.add("butonsSection");
        let closeBtn = document.createElement("button");
        let nextBtn = document.createElement("button");
        let prevButton = document.createElement("button");
        let caption = document.createElement("p");
        caption.innerHTML = `<h3 class="text-center" >${img.alt}</h3>`;
        prevButton.innerText = "Previous";
        nextBtn.innerText = "Next";

        nextBtn.classList.add("nextButton");
        prevButton.classList.add("prevButton");
        nextBtn.addEventListener("click", function () {
          if (count >= imgs.length - 1) {
            count = 0;
          } else {
            count++;
          }

          imgPreview.src = imgs[count].src;
        });

        prevButton.addEventListener("click", function () {
          if (count === 0) {
            count = imgs.length - 1;
          } else {
            count--;
          }

          imgPreview.src = imgs[count].src;
        });

        closeBtn.classList.add("closeBtn");
        closeBtn.innerText = "Close";
        closeBtn.addEventListener("click", function () {
          openDiv.remove();
        });

        imgPreview.classList.add("imgPreview");
        imgPreview.src = this.src;

        butonsSection.append(prevButton, nextBtn, caption);
        openDiv.append(imgPreview, butonsSection, closeBtn);

        openDiv.classList.add("openDiv");

        document.querySelector("body").append(openDiv);
      }
    });
  });
};

window.onload = () => {
  console.log("Placing an AJAX call to the server!");
  // get topk images from db
  $.ajax({
    url: "/topk/10",
    type: "GET",
    success: (data) => {
      console.log("we got the data!");
      // the parent
      var galleryElement = $(".gallery")[0];
      data.forEach((x, i) => {
        // create elementcaption,
        var imageSrc = `https://drive.google.com/uc?export=view&id=${x.file_id}`;
        var elem = document.createElement("a");
        elem.innerHTML = `<img src="${imageSrc}" alt="${x.votes} Likes" /></a>`;
        // attach to parent
        elem.classList.add("all");
        if (parseInt(x.votes) > 0) {
          elem.classList.add("Liked");
        } else {
          elem.classList.add("Disliked");
        }
        galleryElement.appendChild(elem);
      });
      // initiate mechanisms for navigation
      initMechanisms();
    },
    error: (err) => {
      console.log(`Error: ${error}`);
    },
  });
};
