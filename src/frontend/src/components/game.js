import { startCamera, stopCamera } from "./video.js";

let gameRunning = false; // Track game state

export function startGame() {
    if (!gameRunning) {
        console.log("Game starting...");
        startCamera(); // Start video feed
        gameRunning = true;
        document.dispatchEvent(new CustomEvent("gameStateChanged", { detail: { running: true } }));
    }
}

export function stopGame() {
    if (gameRunning) {
        console.log("Game stopping...");
        stopCamera(); // Stop video feed
        gameRunning = false;
        document.dispatchEvent(new CustomEvent("gameStateChanged", { detail: { running: false } }));
    }
}

export function isGameRunning() {
    return gameRunning;
}
