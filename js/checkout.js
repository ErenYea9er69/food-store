document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display cart items
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    function displayCheckoutItems() {
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        checkoutItems.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }

    displayCheckoutItems();

    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the order to a server
        alert('Order placed successfully!');
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to homepage
        window.location.href = 'index.html';
    });
});