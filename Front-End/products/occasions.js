const occasionButtons = document.querySelectorAll("[data-occasion]");
const occasionLinks = document.querySelectorAll("[data-occasion-link]");
const productGrid = document.getElementById("occasionProductGrid");
const title = document.getElementById("occasionProductsTitle");

const localOccasionFlowers = {
  Wedding: [
    { name: "Rose", type: "Romantic flower", price: 35, quantity: 12, occasion: "Wedding, Anniversary", imagePath: "flower/rose.jpg" },
    { name: "Lisianthus", type: "Elegant bouquet flower", price: 28, quantity: 10, occasion: "Wedding", imagePath: "flower/lisianthus.jpg" },
    { name: "Tulip", type: "Soft spring flower", price: 22, quantity: 18, occasion: "Wedding, Anniversary", imagePath: "flower/tulip.jpg" }
  ],
  Birthday: [
    { name: "Sunflower", type: "Bright celebration flower", price: 24, quantity: 16, occasion: "Birthday, Congratulations", imagePath: "flower/sunflower.jpg" },
    { name: "Gerberas", type: "Colorful cheerful flower", price: 20, quantity: 20, occasion: "Birthday", imagePath: "flower/gerberas.jpg" },
    { name: "Daisies", type: "Friendly fresh flower", price: 18, quantity: 25, occasion: "Birthday, Congratulations", imagePath: "flower/daisies.jpg" }
  ],
  Sympathy: [
    { name: "Lilies", type: "Peaceful white flower", price: 30, quantity: 9, occasion: "Sympathy, Funerals", imagePath: "flower/lilies.jpg" },
    { name: "Alstroemerias", type: "Gentle remembrance flower", price: 26, quantity: 14, occasion: "Sympathy", imagePath: "flower/alstroemerias.jpg" },
    { name: "Lisianthus", type: "Soft comfort flower", price: 28, quantity: 10, occasion: "Sympathy", imagePath: "flower/lisianthus.jpg" }
  ],
  Anniversary: [
    { name: "Rose", type: "Classic love flower", price: 35, quantity: 12, occasion: "Anniversary", imagePath: "flower/rose.jpg" },
    { name: "Tulip", type: "Graceful love flower", price: 22, quantity: 18, occasion: "Anniversary", imagePath: "flower/tulip.jpg" }
  ],
  Congratulations: [
    { name: "Sunflower", type: "Success celebration flower", price: 24, quantity: 16, occasion: "Congratulations", imagePath: "flower/sunflower.jpg" },
    { name: "Gerberas", type: "Happy achievement flower", price: 20, quantity: 20, occasion: "Congratulations", imagePath: "flower/gerberas.jpg" },
    { name: "Daisies", type: "Fresh cheerful flower", price: 18, quantity: 25, occasion: "Congratulations", imagePath: "flower/daisies.jpg" }
  ]
};

async function loadOccasionProducts(occasion) {
  title.textContent = `${occasion} Flowers`;
  productGrid.innerHTML = `<p class="empty-state">Loading suitable flowers...</p>`;

  try {
    const response = await fetch(`http://localhost:5035/api/Products/ByOccasion?occasion=${encodeURIComponent(occasion)}`);
    if (!response.ok) {
      throw new Error("Unable to load occasion flowers.");
    }

    const products = await response.json();

    const flowers = products.length ? products : (localOccasionFlowers[occasion] || []);

    productGrid.innerHTML = "";
    flowers.forEach(product => {
      const card = document.createElement("article");
      card.className = "occasion-product-card";
      const imageSrc = product.imagePath && product.imagePath.startsWith("Images/")
        ? `http://localhost:5035/${product.imagePath}`
        : product.imagePath;

      card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>Type: ${product.type}</p>
        <p>Price: $${product.price}</p>
        <p>Available: ${product.quantity}</p>
        <p>Suitable for: ${product.occasion || occasion}</p>
      `;
      productGrid.appendChild(card);
    });
  } catch (error) {
    const flowers = localOccasionFlowers[occasion] || [];
    productGrid.innerHTML = "";

    if (!flowers.length) {
      productGrid.innerHTML = `<p class="empty-state">${error.message}</p>`;
      return;
    }

    flowers.forEach(product => {
      const card = document.createElement("article");
      card.className = "occasion-product-card";
      card.innerHTML = `
        <img src="${product.imagePath}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>Type: ${product.type}</p>
        <p>Price: $${product.price}</p>
        <p>Available: ${product.quantity}</p>
        <p>Suitable for: ${product.occasion}</p>
      `;
      productGrid.appendChild(card);
    });
  }
}

function selectOccasion(occasion) {
  occasionButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.occasion === occasion);
  });
  loadOccasionProducts(occasion);
}

occasionButtons.forEach(button => {
  button.addEventListener("click", () => selectOccasion(button.dataset.occasion));
});

occasionLinks.forEach(link => {
  link.addEventListener("click", () => selectOccasion(link.dataset.occasionLink));
});

const initialOccasion = new URLSearchParams(window.location.search).get("occasion") || "Wedding";
selectOccasion(initialOccasion);
