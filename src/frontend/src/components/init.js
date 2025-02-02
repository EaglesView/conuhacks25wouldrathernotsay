import Leaderboard from "./leaderboards.js";
import { openItems } from "./items.js";
import { startGame } from "./game.js";
import { loadNavbar } from "./nav.js";
import Card from "./card.js";
import NewGame from "./newGame.js"; // Import the overlay component

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded inside init.js");
    loadNavbar();

    // Create menu overlay
    const menuCard = new Card("Far West AI Game", () => {}, ["main-menu"]);
    const leaderboard = new Leaderboard(); // Ensures it doesn’t auto-open
    const gameOverlay = new NewGame(startGame); // Initialize the overlay

    const buttons = [
        { id: "startButton", text: "Start Game", action: () => gameOverlay.show() },
        { id: "leaderboardButton", text: "Leaderboards", action: () => leaderboard.open() },
        { id: "itemsButton", text: "Items", action: openItems }
    ];

    const buttonElements = buttons.map(({ id, text, action }) => {
        const button = document.createElement("button");
        button.id = id;
        button.classList.add("button");
        button.textContent = text;
        button.addEventListener("click", () => {
            menuCard.close();
            action();
        });
        return button;
    });

    menuCard.setContent(buttonElements);
    menuCard.open(); // Opens the menu with buttons on page load
});
