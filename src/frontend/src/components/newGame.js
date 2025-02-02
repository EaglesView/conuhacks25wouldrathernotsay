import Card from "./card.js";
import { hats, updateHat } from "./items.js";

export default function NewGame(onStart) {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "none"; // Initially hidden
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const card = new Card("Choose Your Hat", () => overlay.style.display = "none", ["game-card"]);

    const hatContainer = document.createElement("div");
    hatContainer.classList.add("selection-container");

    const hatLeftButton = document.createElement("button");
    hatLeftButton.textContent = "<";
    hatLeftButton.classList.add("nav-button");

    const hatDisplay = document.createElement("img");
    hatDisplay.src = `./assets/hats/${hats[0]}`;
    hatDisplay.classList.add("item-preview");
    hatDisplay.id = "hatPreview";

    const hatRightButton = document.createElement("button");
    hatRightButton.textContent = ">";
    hatRightButton.classList.add("nav-button");

    hatLeftButton.addEventListener("click", () => updateHat(-1, hatDisplay));
    hatRightButton.addEventListener("click", () => updateHat(1, hatDisplay));

    hatContainer.append(hatLeftButton, hatDisplay, hatRightButton);

    const termsDiv = document.createElement("div");
    const termsCheckbox = document.createElement("input");
    termsCheckbox.type = "checkbox";
    termsCheckbox.id = "terms";

    const termsLabel = document.createElement("label");
    termsLabel.htmlFor = "terms";
    termsLabel.textContent = "I have read the terms and conditions";

    termsDiv.appendChild(termsCheckbox);
    termsDiv.appendChild(termsLabel);

    const playButton = document.createElement("button");
    playButton.id = "play-now";
    playButton.textContent = "Play Now";
    playButton.disabled = true;

    playButton.addEventListener("click", () => {
        if (termsCheckbox.checked) {
            overlay.style.display = "none";
            onStart();
        }
    });

    termsCheckbox.addEventListener("change", () => {
        playButton.disabled = !termsCheckbox.checked;
    });

    card.setContent([hatContainer, termsDiv, playButton]);

    overlay.appendChild(card.overlay);
    document.body.appendChild(overlay); // Ensure it's in the DOM

    return {
        show: () => {
            console.log("Showing overlay"); // Debugging
            overlay.style.display = "flex"; // Make it visible
        },
        hide: () => (overlay.style.display = "none"),
    };
}
