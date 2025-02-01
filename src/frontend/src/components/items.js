const backgrounds = [
    "background1.jpg",
    "background2.jpg",
    "background3.jpg"
];

const hats = [
    "hat1.png",
    "hat2.png",
    "hat3.png"
];

let currentBackgroundIndex = 0;
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

    // Background Selector
    const backgroundContainer = document.createElement("div");
    backgroundContainer.classList.add("selection-container");

    const bgLeftButton = document.createElement("button");
    bgLeftButton.textContent = "<";
    bgLeftButton.classList.add("nav-button");
    bgLeftButton.addEventListener("click", () => updateBackground(-1));

    const bgDisplay = document.createElement("img");
    bgDisplay.src = `./assets/backgrounds/${backgrounds[currentBackgroundIndex]}`;
    bgDisplay.classList.add("item-preview");
    bgDisplay.id = "backgroundPreview";

    const bgRightButton = document.createElement("button");
    bgRightButton.textContent = ">";
    bgRightButton.classList.add("nav-button");
    bgRightButton.addEventListener("click", () => updateBackground(1));

    backgroundContainer.append(bgLeftButton, bgDisplay, bgRightButton);

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
    menuContainer.append(header, backgroundContainer, hatContainer);
    overlay.appendChild(menuContainer);
    document.body.appendChild(overlay);
}

// Function to update the background
function updateBackground(direction) {
    currentBackgroundIndex = (currentBackgroundIndex + direction + backgrounds.length) % backgrounds.length;
    document.getElementById("backgroundPreview").src = `./assets/backgrounds/${backgrounds[currentBackgroundIndex]}`;
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

