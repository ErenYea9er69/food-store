document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.auth-form');
    const nameInput = signupForm.querySelector('input[type="text"]');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userName = nameInput.value;

        if (userName) {
            // Get pending discount from session storage
            const pendingDiscount = sessionStorage.getItem('pendingDiscount');
            
            // Create user object with discount if available
            const user = {
                name: userName,
                discount: pendingDiscount ? parseFloat(pendingDiscount) : null,
                discountApplied: false
            };

            // Store user in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            // Clear the pending discount
            sessionStorage.removeItem('pendingDiscount');

            // Redirect to homepage
            window.location.href = 'index.html';
        }
    });
});