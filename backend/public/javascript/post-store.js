// console.log("This is the page")
// function submitFarmerStoreData(e) {
//     e.preventDefault()
//     //This is the input for the store
//     const storeNameInput = document.getElementById('store__name'); // Assuming store name input is outside the form
//     console.log('Store name input', storeNameInput)

//     const mushroomsData = [];
//     let productsData = [];
//     const mushroomElements = document.querySelectorAll('.mushroom__list'); // Modify selector as needed
//     console.log(mushroomElements);

//     const formData = new FormData();
//     const imageInput = document.querySelector('.image-file-mushroom');

//     if (imageInput.files.length > 0) {
//         for (let i = 0; i < imageInput.files.length; i++) {
//             formData.append('image-file-product', imageInput.files[i]);
//         }
//     }
//     //This is for the types of the mushrooms
//     for (const mushroomElement of mushroomElements) {
//         const mushroom = {
//             type: mushroomElement.querySelector('.mushroom-type').value,
//             formData, // Assuming image input logic is handled elsewhere
//             size: mushroomElement.querySelector('.mushroom-size').value,
//             intendedUse: mushroomElement.querySelector('.mushroom-use').value,

//         };
//         mushroomsData.push(mushroom);
//     }
//     const productFormData = new FormData();

//     //this is the inordered list that has the products to be added
//     const productElements = document.querySelectorAll('.product-list'); // Modify selector as needed
//     //this is the image files for the produscts
//     const productInput = document.querySelector('.image-file-product');

//     if (productInput.files.length > 0) {
//         for (let i = 0; i < productInput.files.length; i++) {
//             productFormData.append('image-file-product', productInput.files[i]);
//         }
//     }
//         for (const productElement of productElements) {
//             const product = {
//                 name: productElement.querySelector('#product-name').value,
//                 description: productElement.querySelector('#product-description').value,
//                 price: parseFloat(productElement.querySelector('#product-price').value),
//                 productFormData, // Assuming image input exists
//             };
//             productsData.push(product);
//         }


//         const data = {
//             storeName: storeNameInput.value,
//             mushrooms: mushroomsData,
//             products: productsData
//         };

//         console.log("This is the data sent to the db", data)
//         fetch('/farmer/store/create', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Success:', data);
//                 // Add success message or handle success state in your UI
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 // Add error message or handle error state in your UI
//             });
//     }

//     // Add event listener to submit button
//     const submitButton = document.querySelector('.store__form').querySelector('button[type="submit"]');
//     submitButton.addEventListener('click', (e) => { submitFarmerStoreData(e) });
let mushroomTypeCount = 1;

function addMushroomType() {
    mushroomTypeCount++;
    const container = document.querySelector('.mushroom__list');
    const newType = document.createElement('li');
    newType.className = 'mushroom__item';
    newType.innerHTML = `
        <h3>Mushroom Type ${mushroomTypeCount}</h3>
        <label for="name-${mushroomTypeCount}">Name:</label>
        <input type="text" id="name-${mushroomTypeCount}" name="mushrooms[${mushroomTypeCount - 1}][name]" required><br><br>
        <label for="description-${mushroomTypeCount}">Description:</label>
        <textarea id="description-${mushroomTypeCount}" name="mushrooms[${mushroomTypeCount - 1}][description]" required></textarea><br><br>
        <label for="images-${mushroomTypeCount}">Images:</label>
        <input type="file" id="images-${mushroomTypeCount}" name="mushrooms[${mushroomTypeCount - 1}][images][]" multiple required><br><br>
        <section class="store__name">
            <div>
                <label for="">Type ${mushroomTypeCount} of mushroom grown</label>
                <input class="mushroom-type" type="text" placeholder="Type" name="mushrooms[${mushroomTypeCount - 1}][type]">
            </div>
        </section>
        <div class="store__address">
            <label for="">Images of the Type grown</label>
            <input class="image-file-mushroom" type="file" placeholder="Images" name="mushrooms[${mushroomTypeCount - 1}][images][]"
                accept="image/*">
        </div>
        <section class="store__more-info">
            <section class="store__location">
                <div>
                    <label for="size-${mushroomTypeCount}">Size</label>
                    <input id ="size-${mushroomTypeCount}" class="mushroom-size" type="text" placeholder="Size" name="mushrooms[${mushroomTypeCount - 1}][size]">
                </div>
                <div>
                    <label for="use-${mushroomTypeCount}">Intended Use Of the Mushroom</label>
                    <input id="use-${mushroomTypeCount}" class="mushroom-use" type="text" placeholder="Use" name="mushrooms[${mushroomTypeCount - 1}][use]">
                </div>
            </section>
        </section>
      `;
    container.appendChild(newType);
}