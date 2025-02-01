// Leaderboard.js

import { getLeaderboardStats } from "./stats.js";

export default class Leaderboard {
  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add("leaderboard-overlay");

    this.leaderboard = document.createElement("div");
    this.leaderboard.classList.add("leaderboard-content");

    this.closeButton = document.createElement("button");
    this.closeButton.innerHTML = "&#10006;"; // X symbol
    this.closeButton.classList.add("close-btn");
    this.closeButton.addEventListener("click", () => this.close());

    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.placeholder = "Search by name...";
    this.searchInput.classList.add("search-input");
    this.searchInput.addEventListener("input", () => this.filterTable());

    this.table = document.createElement("table");
    this.table.classList.add("leaderboard-table");

    this.loadData();

    this.leaderboard.appendChild(this.closeButton);
    this.leaderboard.appendChild(this.searchInput);
    this.leaderboard.appendChild(this.table);
    this.container.appendChild(this.leaderboard);
    document.body.appendChild(this.container);
  }

  async loadData() {
    const stats = await getLeaderboardStats();
    this.renderTable(stats);
  }

  renderTable(data) {
    this.table.innerHTML = ""; // Clear previous content

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const nameHeader = document.createElement("th");
    nameHeader.textContent = "Name";
    nameHeader.addEventListener("click", () => this.sortTable(0));

    const pointsHeader = document.createElement("th");
    pointsHeader.textContent = "Points";
    pointsHeader.addEventListener("click", () => this.sortTable(1));

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

  sortTable(colIndex) {
    const rows = Array.from(this.table.querySelectorAll("tbody tr"));
    const sortedRows = rows.sort((a, b) => {
      const valA = a.children[colIndex].textContent;
      const valB = b.children[colIndex].textContent;
      return colIndex === 1 ? Number(valB) - Number(valA) : valA.localeCompare(valB);
    });

    const tbody = this.table.querySelector("tbody");
    tbody.innerHTML = "";
    sortedRows.forEach((row) => tbody.appendChild(row));
  }

  close() {
    this.container.style.display = "none";
  }

  open() {
    this.container.style.display = "flex";
  }
}
