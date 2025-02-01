import Leaderboard from "./leaderboards.js";
import { startCamera, captureFrame } from "./video.js";  // Ensure this is correctly imported

const leaderboard = new Leaderboard();

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.id = "overlay";

    const menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

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

    overlay.appendChild(menuContainer);
    document.body.appendChild(overlay);

    function startGame() {
        console.log("Starting game...");
        startCamera();  // Ensure camera starts when game starts
    }

    function openLeaderboards() {
        console.log("Opening leaderboards...");
        leaderboard.open();
    }
    

    function openItems() {
        console.log("Showing items...");
    }
});
