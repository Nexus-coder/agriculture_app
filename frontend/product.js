const addProductButton = document.getElementById("add-product");
const productList = document.querySelector(".product-list");
const productForm = document.getElementById("product-form");

addProductButton.addEventListener("click", function() {
  // Clone the product form
  const newProductForm = productForm.cloneNode(true);

  // Clear existing form values (optional)
  const formInputs = newProductForm.querySelectorAll("input, textarea");
  for (let input of formInputs) {
    input.value = "";
  }

  // Append the new form to the product list
  productList.appendChild(newProductForm);
});

// Update existing script.js code to handle submission of multiple products:

productForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission

  const productData = []; // Array to store product data

  // Loop through all product forms in the product list
  const productForms = productList.querySelectorAll("form");
  for (const form of productForms) {
    // Extract product data from each form
    const product = {
      name: form.querySelector("#product-name").value,
      description: form.querySelector("#product-description").value,
      price: form.querySelector("#product-price").value,
      image: form.querySelector("#product-image").files[0], // Access uploaded image file
      // Add other product details as needed
    };
    productData.push(product);
  }

  // Send the product data array to your backend for processing (using fetch or XMLHttpRequest)
  // ... (implementation depends on your backend)

  // Optionally, update the product list after successful submission
  // ... (logic to display submitted products)
});
