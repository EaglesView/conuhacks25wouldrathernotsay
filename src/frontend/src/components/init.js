import Leaderboard from "./leaderboards.js";
import { openItems } from "./items.js";
import { startGame, stopGame, isGameRunning } from "./game.js";
import { loadNavbar } from "./nav.js"; // Import the function that initializes the navbar

const leaderboard = new Leaderboard();

document.addEventListener("DOMContentLoaded", () => {
    // Load Navbar dynamically
    console.log("loaded inside init.js")
    loadNavbar();

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.id = "overlay";

    const menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

    // Header container (for title + close button)
    const header = document.createElement("div");
    header.classList.add("menu-header");

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&#10006;"; // X symbol
    closeButton.classList.add("close-btn");
    closeButton.addEventListener("click", () => overlay.remove());

    // Title
    const title = document.createElement("h2");
    title.textContent = "Far West AI Game";
    title.classList.add("menu-title");

    // Append title first, then close button
    header.appendChild(title);
    header.appendChild(closeButton);

    // Buttons for the menu
    const buttons = [
        { id: "startButton", text: "Start Game", action: startGame },
        { id: "leaderboardButton", text: "Leaderboards", action: openLeaderboards },
        { id: "itemsButton", text: "Items", action: openItems }
    ];

    buttons.forEach(({ id, text, action }) => {
        const button = document.createElement("button");
        button.id = id;
        button.classList.add("button");
        button.textContent = text;

        button.addEventListener("click", () => {
            overlay.remove();
            action();
        });

        menuContainer.appendChild(button);
    });

    // Append header and buttons to menu container
    menuContainer.prepend(header);
    overlay.appendChild(menuContainer);
    document.body.appendChild(overlay);

    function openLeaderboards() {
        console.log("Opening leaderboards...");
        leaderboard.open();
    }
});
