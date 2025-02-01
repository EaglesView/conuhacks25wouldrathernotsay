import { getLeaderboardStats } from "./stats.js";

export default class Leaderboard {
    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("leaderboard-overlay");
        this.container.style.display = "none"; // Hide initially

        this.leaderboard = document.createElement("div");
        this.leaderboard.classList.add("menu-container", "leaderboard-content");

        // Header container (for close button + title)
        this.header = document.createElement("div");
        this.header.classList.add("leaderboard-header");

        // Close button
        this.closeButton = document.createElement("button");
        this.closeButton.innerHTML = "&#10006;"; // X symbol
        this.closeButton.classList.add("close-btn");
        this.closeButton.addEventListener("click", () => this.close());

        // Title
        this.title = document.createElement("h2");
        this.title.textContent = "Leaderstats";
        this.title.classList.add("leaderboard-title");

        // Append close button first (left), then title (right)
        this.header.appendChild(this.closeButton);
        this.header.appendChild(this.title);

        // Search Input
        this.searchInput = document.createElement("input");
        this.searchInput.type = "text";
        this.searchInput.placeholder = "Search by name...";
        this.searchInput.classList.add("search-input");
        this.searchInput.addEventListener("input", () => this.filterTable());

        // Table
        this.table = document.createElement("table");
        this.table.classList.add("leaderboard-table");

        // Append everything in order
        this.leaderboard.appendChild(this.header);
        this.leaderboard.appendChild(this.searchInput);
        this.leaderboard.appendChild(this.table);
        this.container.appendChild(this.leaderboard);
        document.body.appendChild(this.container);

        this.dataLoaded = false; // Flag to load data only once
        this.sortDirections = [true, true]; // Default sorting order (true = ascending)
    }
    async loadData() {
        if (!this.dataLoaded) {
            const stats = await getLeaderboardStats();
            this.renderTable(stats);
            this.dataLoaded = true;
        }
    }

    renderTable(data) {
        this.table.innerHTML = ""; // Clear previous content

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const nameHeader = document.createElement("th");
        nameHeader.innerHTML = `Name <span class="sort-icon"></span>`;
        nameHeader.addEventListener("click", () => this.sortTable(0, nameHeader));

        const pointsHeader = document.createElement("th");
        pointsHeader.innerHTML = `Points <span class="sort-icon"></span>`;
        pointsHeader.addEventListener("click", () => this.sortTable(1, pointsHeader));

        headerRow.appendChild(nameHeader);
        headerRow.appendChild(pointsHeader);
        thead.appendChild(headerRow);

        const tbody = document.createElement("tbody");
        data.forEach((player) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${player.name}</td><td>${player.points}</td>`;
            tbody.appendChild(row);
        });

        this.table.appendChild(thead);
        this.table.appendChild(tbody);
    }

    filterTable() {
        const query = this.searchInput.value.toLowerCase();
        const rows = this.table.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            const name = row.children[0].textContent.toLowerCase();
            row.style.display = name.includes(query) ? "" : "none";
        });
    }

    sortTable(colIndex, headerElement) {
        const rows = Array.from(this.table.querySelectorAll("tbody tr"));
        const ascending = this.sortDirections[colIndex]; // Get current direction

        // Sort rows
        const sortedRows = rows.sort((a, b) => {
            const valA = a.children[colIndex].textContent;
            const valB = b.children[colIndex].textContent;
            return colIndex === 1
                ? ascending ? Number(valA) - Number(valB) : Number(valB) - Number(valA)
                : ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

        // Update sorting direction
        this.sortDirections[colIndex] = !ascending;

        // Update the table
        const tbody = this.table.querySelector("tbody");
        tbody.innerHTML = "";
        sortedRows.forEach((row) => tbody.appendChild(row));

        // Update sorting icon
        this.updateSortIcons(colIndex, headerElement, ascending);
    }

    updateSortIcons(colIndex, headerElement, ascending) {
        // Reset all icons
        const headers = this.table.querySelectorAll("th");
        headers.forEach((header) => {
            const icon = header.querySelector(".sort-icon");
            if (icon) icon.textContent = "";
        });

        // Set current icon
        const icon = headerElement.querySelector(".sort-icon");
        icon.textContent = ascending ? "▲" : "▼"; // Update icon
    }

    open() {
        this.container.style.display = "flex";
        this.loadData(); // Load data when opened
    }

    close() {
        this.container.style.display = "none";
    }
}
