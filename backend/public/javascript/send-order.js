const orderForm = document.querySelector('.billing__form');
const orderButton = document.querySelector('.order__summary-button')
orderForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(orderForm);

    // Extract form data and calculate total price
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const address = formData.get('address');
    const country = formData.get('country');
    const email = formData.get('email');
    const phone = formData.get('phone');

    const items = []; // To store parsed order items (assuming elements exist)

    const orderList = document.querySelector('.order__summary-list');
    orderList.querySelectorAll('li').forEach(item => {
        const id = item.dataset.id
        const itemName = item.querySelector('p').textContent.split('x')[0].trim();
        const quantity = parseInt(item.querySelector('p').textContent.split('x')[1], 10);
        const price = parseFloat(item.nextElementSibling.querySelector('span').textContent.slice(2));

        items.push({ id, quantity, price });
    });
    console.log("This are the items", items)
    const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const paymentMethod = document.querySelector('#cash_on_delivery').checked ? 'cash_on_delivery' : '';

    const orderObject = {
        firstName,
        lastName,
        address,
        country,
        email,
        phone,
        items,
        totalPrice,
        paymentMethod
    };

    // Send the order data to MongoDB via fetch
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderObject)
    })
        .then(response => {
            if (response.ok) {
                console.log('Order data sent successfully!');
                // Handle successful submission (e.g., display confirmation message)
            } else {
                console.error('Error sending order data:', response.statusText);
                // Handle submission errors (e.g., display error message)
            }
        });
});