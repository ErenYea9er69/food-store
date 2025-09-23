document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.auth-form');
    // Targets the first input field, which is for the Full Name.
    const nameInput = signupForm.querySelector('input[type="text"]');

    signupForm.addEventListener('submit', (e) => {
        // Prevents the form from actually submitting and reloading the page.
        e.preventDefault();

        const userName = nameInput.value;

        // Checks if a name was entered.
        if (userName) {
            // Creates a user object to simulate a real user profile.
            const user = {
                name: userName
            };
            // Stores the user object in localStorage to maintain a "logged in" state.
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            // Redirects the user to the homepage after successful "sign-up".
            window.location.href = 'index.html';
        }
    });
});