

const hats = [
    "hat1.png",
    "hat2.png",
    "hat3.png"
];

let currentHatIndex = 0;

export function openItems() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.id = "itemsOverlay";

    const menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

    // Header container (Title + Close button)
    const header = document.createElement("div");
    header.classList.add("menu-header");

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&#10006;"; // X symbol
    closeButton.classList.add("close-btn");
    closeButton.addEventListener("click", () => overlay.remove());

    // Title
    const title = document.createElement("h2");
    title.textContent = "Customize Items";
    title.classList.add("menu-title");

    // Append title first, then close button
    header.appendChild(title);
    header.appendChild(closeButton);


    // Hat Selector
    const hatContainer = document.createElement("div");
    hatContainer.classList.add("selection-container");

    const hatLeftButton = document.createElement("button");
    hatLeftButton.textContent = "<";
    hatLeftButton.classList.add("nav-button");
    hatLeftButton.addEventListener("click", () => updateHat(-1));

    const hatDisplay = document.createElement("img");
    hatDisplay.src = `./assets/hats/${hats[currentHatIndex]}`;
    hatDisplay.classList.add("item-preview");
    hatDisplay.id = "hatPreview";

    const hatRightButton = document.createElement("button");
    hatRightButton.textContent = ">";
    hatRightButton.classList.add("nav-button");
    hatRightButton.addEventListener("click", () => updateHat(1));

    hatContainer.append(hatLeftButton, hatDisplay, hatRightButton);

    // Append everything to the menu container
    menuContainer.append(header, hatContainer);
    overlay.appendChild(menuContainer);
    document.body.appendChild(overlay);
}


// Function to update the hat
function updateHat(direction) {
    currentHatIndex = (currentHatIndex + direction + hats.length) % hats.length;
    
    // Ensure element exists before updating
    const hatPreview = document.getElementById("hatPreview");
    if (hatPreview) {
        hatPreview.src = `./assets/hats/${hats[currentHatIndex]}`;
    } else {
        console.error("Hat preview element not found!");
    }
}

