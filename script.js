const gallery = document.querySelector(".gallery");
const galleryImages = [...document.querySelectorAll(".gallery .image")];
const fullImageContainer = document.querySelector(".full-image-container");
const fullImage = document.querySelector(".full-image");
const closeButton = document.querySelector(".close-button");
const boxesAmountInput = document.querySelector("#boxes-amount");
const boxesContainer = document.querySelector("#boxes");

let activeImageIndex = 0;

function showImage(index) {
  activeImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeImageIndex];

  fullImage.src = image.src;
  fullImage.alt = image.alt;
}

function openImage(index) {
  showImage(index);
  fullImageContainer.classList.add("is-open");
  fullImageContainer.setAttribute("aria-hidden", "false");
  closeButton.focus();
}

function closeImage() {
  fullImageContainer.classList.remove("is-open");
  fullImageContainer.setAttribute("aria-hidden", "true");
  fullImage.removeAttribute("src");
}

gallery.addEventListener("click", event => {
  const image = event.target.closest(".image");

  if (!image) {
    return;
  }

  openImage(galleryImages.indexOf(image));
});

closeButton.addEventListener("click", closeImage);

fullImageContainer.addEventListener("click", event => {
  if (event.target === fullImageContainer) {
    closeImage();
  }
});

document.addEventListener("keydown", event => {
  if (fullImageContainer.classList.contains("is-open")) {
    if (event.key === "Escape") {
      closeImage();
    } else if (event.key === "ArrowLeft") {
      showImage(activeImageIndex - 1);
    } else if (event.key === "ArrowRight") {
      showImage(activeImageIndex + 1);
    }

    return;
  }

  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    gallery.scrollBy({
      left: (event.key === "ArrowRight" ? 1 : -1) * gallery.clientWidth * 0.8,
      behavior: "smooth",
    });
  }
});

function createBoxes(amount) {
  boxesContainer.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (let index = 0; index < amount; index += 1) {
    const size = 30 + index * 10;
    const box = document.createElement("div");

    box.style.width = `${size}px`;
    box.style.height = `${size}px`;
    box.style.backgroundColor = `rgb(${getRandomNumber()}, ${getRandomNumber()}, ${getRandomNumber()})`;

    fragment.append(box);
  }

  boxesContainer.append(fragment);
}

function destroyBoxes() {
  boxesContainer.replaceChildren();
}

function getRandomNumber() {
  return Math.floor(Math.random() * 256);
}

document.querySelector("#controls").addEventListener("click", event => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.action === "render") {
    const amount = boxesAmountInput.valueAsNumber;

    if (Number.isInteger(amount) && amount >= 0 && amount <= 100) {
      createBoxes(amount);
    }
  } else if (button.dataset.action === "destroy") {
    destroyBoxes();
  }
});
