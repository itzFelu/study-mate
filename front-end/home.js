var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    // console.log(content.style.display === "block")
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

let currentIndex = 0;

function changeSlide(n) {
  currentIndex += n;
  showSlide(currentIndex);
}

function showSlide(index) {
  const gallery = document.querySelector(".gallery");
  const slides = document.querySelectorAll(".gallery img");

  if (index < 0) {
    currentIndex = slides.length - 1;
  } else if (index >= slides.length) {
    currentIndex = 0;
  }

  const translateValue = -currentIndex * 100 + "%";
  gallery.style.transform = "translateX(" + translateValue + ")";
}

// Optional: Auto slide change every 3 seconds
setInterval(function () {
  changeSlide(1);
}, 3000);
