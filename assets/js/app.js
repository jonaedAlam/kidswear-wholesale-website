const WHATSAPP_NUMBER = "91XXXXXXXXXX";


const productGrid =
  document.getElementById("productGrid");


const categoryFilter =
  document.getElementById("categoryFilter");


const ageFilter =
  document.getElementById("ageFilter");


const collectionFilter =
  document.getElementById("collectionFilter");


const availabilityFilter =
  document.getElementById("availabilityFilter");


function stockText(product) {

  if (product.status === "soldout") {
    return "Sold Out";
  }

  if (product.status === "low") {
    return `Low Stock • ${product.quantity} pcs`;
  }

  return `Available • ${product.quantity} pcs`;
}



function createWhatsAppLink(product) {

  const message = `Hello,

I am interested in the following wholesale item:

Product: ${product.name}
Code: ${product.sku}
Age: ${product.age} Years
Wholesale Price: ₹${product.price}
MOQ: ${product.moq} pcs

Please confirm available quantity and shipping details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

}



function createProductCard(product) {

  const imageContent = product.image

    ? `
      <img
        src="${product.image}"
        alt="${product.name}"
      >
    `

    : `
      <div class="product-placeholder">
        PRODUCT IMAGE<br>
        ${product.sku}
      </div>
    `;


  const badge =
    product.newArrival

    ? `<span class="product-badge">NEW LOT</span>`

    : `<span class="product-badge">LIMITED LOT</span>`;


  const whatsappButton =
    product.status === "soldout"

    ? ""

    : `
      <a
        class="product-whatsapp"
        href="${createWhatsAppLink(product)}"
        target="_blank"
      >
        Enquire on WhatsApp
      </a>
    `;


  return `

    <article class="product-card">

      <div class="product-image">

        ${imageContent}

        ${badge}

      </div>


      <div class="product-content">

        <div class="product-code">
          ${product.sku}
        </div>


        <h3>
          ${product.name}
        </h3>


        <div class="product-meta">

          ${product.category}

          •

          Age ${product.age} Years

          <br>

          ${product.collection}

          •

          MOQ ${product.moq} pcs

        </div>


        <div class="product-price">

          ₹${product.price}

          <small>
            / piece wholesale
          </small>

        </div>


        <div
          class="stock ${product.status}"
        >

          ${stockText(product)}

        </div>


        ${whatsappButton}

      </div>

    </article>

  `;

}



function renderProducts() {

  const category =
    categoryFilter.value;


  const age =
    ageFilter.value;


  const collection =
    collectionFilter.value;


  const availability =
    availabilityFilter.value;


  const filteredProducts =
    products.filter(product => {

      const categoryMatch =
        category === "all" ||
        product.category === category;


      const ageMatch =
        age === "all" ||
        product.age === age;


      const collectionMatch =
        collection === "all" ||
        product.collection === collection;


      const availabilityMatch =
        availability === "all" ||
        product.status !== "soldout";


      return (
        categoryMatch &&
        ageMatch &&
        collectionMatch &&
        availabilityMatch
      );

    });


  if (filteredProducts.length === 0) {

    productGrid.innerHTML = `

      <p>
        No products currently match these filters.
      </p>

    `;

    return;
  }


  productGrid.innerHTML =
    filteredProducts
      .map(createProductCard)
      .join("");

}



categoryFilter.addEventListener(
  "change",
  renderProducts
);


ageFilter.addEventListener(
  "change",
  renderProducts
);


collectionFilter.addEventListener(
  "change",
  renderProducts
);


availabilityFilter.addEventListener(
  "change",
  renderProducts
);



document
  .querySelectorAll(
    "[data-filter-category]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        categoryFilter.value =
          button.dataset.filterCategory;

        renderProducts();

        document
          .getElementById("catalogue")
          .scrollIntoView();

      }
    );

  });



document
  .querySelectorAll(
    "[data-filter-collection]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const value =
          button.dataset.filterCollection;


        if (value === "new") {

          categoryFilter.value = "all";

          ageFilter.value = "all";

          collectionFilter.value = "all";

          availabilityFilter.value = "available";


          const newProducts =
            products.filter(
              product =>
                product.newArrival &&
                product.status !== "soldout"
            );


          productGrid.innerHTML =
            newProducts
              .map(createProductCard)
              .join("");

        }

        else {

          collectionFilter.value =
            value;

          renderProducts();

        }


        document
          .getElementById("catalogue")
          .scrollIntoView();

      }
    );

  });



document.getElementById("year")
  .textContent =
  new Date().getFullYear();


renderProducts();