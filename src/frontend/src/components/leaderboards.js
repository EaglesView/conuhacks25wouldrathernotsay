import { getLeaderboardStats } from "./stats.js";
import Card from "./card.js";

export default class Leaderboard {
    constructor() {
        this.card = null; // Lazy initialization
        this.dataLoaded = false;
        this.sortDirections = [true, true];
     
    }

    async open() {
        if (!this.card) {
            this.card = new Card("Leaderstats", () => this.close(),["leaderstats-card"]);

            // Search Input
            this.searchInput = document.createElement("input");
            this.searchInput.type = "text";
            this.searchInput.placeholder = "Search by name...";
            this.searchInput.classList.add("search-input");
            this.searchInput.addEventListener("input", () => this.filterTable());

            // Table
            this.table = document.createElement("table");
            this.table.classList.add("leaderboard-table");

            this.card.setContent([this.searchInput, this.table]);
            this.setupEventListeners();
        }

        this.card.open();
        this.loadData();
    }

    async loadData() {
        if (!this.dataLoaded) {
            const stats = await getLeaderboardStats();
            this.renderTable(stats);
            this.dataLoaded = true;
        }
    }
    setupEventListeners() {
        document.querySelector('.search-input').addEventListener('input', (event) => this.filterTable(event));
    }
    renderTable(data) {
        this.table.innerHTML = "";

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

    close() {
        if (this.card) {
            this.card.close();
        }
    }
}
