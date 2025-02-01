document.addEventListener("DOMContentLoaded", () => {
    // Create overlay div
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.id = "overlay";

    // Create menu container
    const menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

    // Button configurations
    const buttons = [
        { id: "startButton", text: "Start Game", action: startGame },
        { id: "leaderboardButton", text: "Leaderboards", action: openLeaderboards },
        { id: "itemsButton", text: "Items", action: openItems }
    ];

    // Create buttons
    buttons.forEach(({ id, text, action }) => {
        const button = document.createElement("button");
        button.id = id;
        button.classList.add("button");
        button.textContent = text;

        // Remove overlay and call respective function
        button.addEventListener("click", () => {
            overlay.remove();
            action();
        });

        menuContainer.appendChild(button);
    });

    // Append menu to overlay
    overlay.appendChild(menuContainer);
    document.body.appendChild(overlay);

    // Functions for each button
    function startGame() {
        console.log("Starting game...");
        // Add actual game start logic here
    }

    function openLeaderboards() {
        console.log("Opening leaderboards...");
        // Add leaderboard display logic here
    }

    function openItems() {
        console.log("Showing items...");
        // Add item shop logic here
    }
});
