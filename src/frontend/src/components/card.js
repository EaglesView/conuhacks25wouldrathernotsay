export default class Card {
    constructor(title, closeCallback, extraClasses = []) {
        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        this.overlay.style.display = "none"; // Start hidden

        this.container = document.createElement("div");
        this.container.classList.add("menu-container");

      

        // Header
        this.header = document.createElement("div");
        this.header.classList.add("menu-header");

        // Title
        this.title = document.createElement("h2");
        this.title.textContent = title;
        this.title.classList.add("menu-title");

        // Close Button
        this.closeButton = document.createElement("button");
        this.closeButton.innerHTML = "&#10006;"; // X symbol
        this.closeButton.classList.add("close-btn");
        this.closeButton.addEventListener("click", () => this.close(closeCallback));

        // Append header elements
        this.header.appendChild(this.title);
        this.header.appendChild(this.closeButton);

        // Content container
        this.content = document.createElement("div");
        this.content.classList.add("card-content");
  // Apply extra classes if provided
  if (Array.isArray(extraClasses)) {
    this.content.classList.add(...extraClasses);
}
        // Append everything
        this.container.appendChild(this.header);
        this.container.appendChild(this.content);
        this.overlay.appendChild(this.container);

        document.body.appendChild(this.overlay);
    }

    setContent(elements) {
        this.content.innerHTML = "";
        elements.forEach((element) => this.content.appendChild(element));
    }

    open() {
        this.overlay.style.display = "flex";
    }

    close(callback) {
        this.overlay.style.display = "none";
        if (callback) callback();
    }
}
