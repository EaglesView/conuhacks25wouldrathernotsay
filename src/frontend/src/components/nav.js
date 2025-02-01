import Leaderboard from "./leaderboards.js";
import { openItems } from "./items.js";
import { startGame, stopGame, isGameRunning } from "./game.js";

export function loadNavbar() {
    const leaderboard = new Leaderboard();

    // Create navbar container
    const navbar = document.createElement("nav");
    navbar.classList.add("navbar");

    // Navbar inner HTML
    navbar.innerHTML = `
        <div class="navbar-container">
            <div class="menu-icon" id="menuIcon">&#9776;</div>
        </div>
        <ul class="nav-links" id="navLinks">
            <li><button class="button" id="startGame">Start Game</button></li>
            <li><button class="button" id="leaderstats">Leaderstats</button></li>
            <li><button class="button" id="items">Items</button></li>
        </ul>
    `;

    // Add navbar to page
    document.body.prepend(navbar);

    // Toggle menu on click
    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.getElementById("navLinks");

    menuIcon.addEventListener("click", function () {
        navLinks.classList.toggle("show");
    });
    document.addEventListener("gameStateChanged", (event) => {
        updateButtonText(event.detail.running);
    });
    // Handle Start/End Game Button
    const startGameButton = document.getElementById("startGame");
    startGameButton.addEventListener("click", () => {
        if (!isGameRunning()) {
            startGame();
        } else {
            stopGame();
        }
    });
    function updateButtonText(running) {
        startGameButton.textContent = running ? "End Game" : "Start Game";
    }
    // Assign leaderboard and items actions
    document.getElementById("leaderstats").addEventListener("click", () => {
        console.log("Opening leaderboards...");
        leaderboard.open();
        navLinks.classList.remove("show"); // Hide menu after selection
    });

    document.getElementById("items").addEventListener("click", () => {
        console.log("Opening items...");
        openItems();
        navLinks.classList.remove("show");
    });
}
