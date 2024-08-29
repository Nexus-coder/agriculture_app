const addToCartButton = document.querySelectorAll('button.circle');
console.log(addToCartButton)
const cart = document.querySelector('cart');
const cartTotal = document.getElementById('cart-total');
console.log('In the products pageq')

addToCartButton.forEach((item, index) => {
    item.addEventListener('click', function (event) {
        console.log('this is the event', event);
        let parent = event.target.parentNode;
        console.log(parent)
        const productName = parent.querySelector('.product-name').textContent
        const str = '\n                                        Confetti …shroom Chips\n                                    ';

        // Regular expression to match word characters and apostrophes
        const nameRegex = /\w+/g;

        // Extract the first match (assuming the product name is the first word)
        const name = productName.match(nameRegex)?.[0].trim();
        const productId = parent.dataset.id
        console.log("the id is", productId)
        const productPrice = parseFloat(parent.querySelector('span').textContent);
        console.log(productPrice)
        // const quantity = parseInt(parent.querySelector('quantity').value);
        addToCart(productId, name, productPrice,)
        updateBadge()
    })
});

// function addToCart(product) {
//     console.log('adding')
//     let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
//     const existingItem = cartItems.find(item => item.productName === product.productName);

//     if (existingItem) {
//         existingItem.quantity++;
//     } else {
//         product.quantity = 1;
//         cartItems.push(product);
//     }

//     localStorage.setItem("cart", JSON.stringify(cartItems));
//     cartItems = JSON.parse(localStorage.getItem("cart")) || [];

//     console.log("Product added to cart:", cartItems);
//     // You can update UI elements to reflect cart changes here (e.g., quantity badge)
// }

function updateBadge() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const quantity = cartItems.length

    const badgeElement = document.querySelector(".cart-num span");
    if (badgeElement) {
        badgeElement.textContent = quantity;
    } else {
        console.warn("Quantity badge element not found for product:");
    }
}

function addToCart(productId, name, price) {
    fetch('/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, price })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Item added to cart:', data);
            // Update UI to reflect cart changes (e.g., badge, cart summary)

        })
        .catch(error => console.error('Error adding to cart:', error));
}


function removeFromCart(productId) {
    fetch(`/cart/remove/${productId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log('Item removed from cart:', data);
            // Update UI to reflect cart changes (e.g., remove item from cart list)
        })
        .catch(error => console.error('Error removing from cart:', error));
}

function fetchCartItems() {
    fetch('/cart')
        .then(response => response.json())
        .then(data => {
            console.log('Cart contents:', data);
            // Update UI to display cart items (e.g., populate cart list)
        })
        .catch(error => console.error('Error fetching cart:', error));
}

function updateCartQuantity(productId, newQuantity) {
    fetch(`/cart/update/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Cart updated:', data);
            // Update UI to reflect quantity change (e.g., update cart item quantity display)
        })
        .catch(error => console.error('Error updating cart:', error));
}
