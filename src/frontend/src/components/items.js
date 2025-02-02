import Card from "./card.js";

export const hats = ["hat1.png", "hat2.png", "hat3.png"];
let currentHatIndex = 0;

export function openItems() {
    const card = new Card("Customize Items", () => card.close());

    const hatContainer = document.createElement("div");
    hatContainer.classList.add("selection-container");

    const hatLeftButton = document.createElement("button");
    hatLeftButton.textContent = "<";
    hatLeftButton.classList.add("nav-button");
    hatLeftButton.addEventListener("click", () => updateHat(-1, hatDisplay));

    const hatDisplay = document.createElement("img");
    hatDisplay.src = `./assets/hats/${hats[currentHatIndex]}`;
    hatDisplay.classList.add("item-preview");
    hatDisplay.id = "hatPreview";

    const hatRightButton = document.createElement("button");
    hatRightButton.textContent = ">";
    hatRightButton.classList.add("nav-button");
    hatRightButton.addEventListener("click", () => updateHat(1, hatDisplay));

    hatContainer.append(hatLeftButton, hatDisplay, hatRightButton);

    card.setContent([hatContainer]);
    card.open();
}

export function updateHat(direction, hatDisplay) {
    currentHatIndex = (currentHatIndex + direction + hats.length) % hats.length;
    hatDisplay.src = `./assets/hats/${hats[currentHatIndex]}`;
}
