// back tot top

let backToTopBtn = document.querySelector('.back-to-top')

window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'flex'
    } else {
        backToTopBtn.style.display = 'none'
    }
}

// top nav menu

let menuItems = document.getElementsByClassName('menu-item')

Array.from(menuItems).forEach((item, index) => {
    item.onclick = (e) => {
        let currMenu = document.querySelector('.menu-item.active')
        currMenu.classList.remove('active')
        item.classList.add('active')
    }
})

// food category

let foodMenuList = document.querySelector('.food-item-wrap')

let foodCategory = document.querySelector('.food-category')

let categories = foodCategory.querySelectorAll('button')

Array.from(categories).forEach((item, index) => {
    item.onclick = (e) => {
        let currCat = foodCategory.querySelector('button.active')
        currCat.classList.remove('active')
        e.target.classList.add('active')
        foodMenuList.classList ='food-item-wrap '+ e.target.getAttribute('data-food-type')
    }
})

// on scroll animation

let scroll = window.requestAnimationFrame || function(callback) {window.setTimeout(callback, 1000/60)}

let elToShow = document.querySelectorAll('.play-on-scroll')

isElInViewPort = (el) => {
    let rect = el.getBoundingClientRect()

    return (
        (rect.top <= 0 && rect.bottom >= 0)
        ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
        ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    )
}

loop = () => {
    elToShow.forEach((item, index) => {
        if (isElInViewPort(item)) {
            item.classList.add('start')
        } else {
            item.classList.remove('start')
        }
    })

    scroll(loop)
}

loop()

// mobile nav

let bottomNavItems = document.querySelectorAll('.mb-nav-item')

let bottomMove = document.querySelector('.mb-move-item')

bottomNavItems.forEach((item, index) => {
    item.onclick = (e) => {
        console.log('object')
        let crrItem = document.querySelector('.mb-nav-item.active')
        crrItem.classList.remove('active')
        item.classList.add('active')
        bottomMove.style.left = index * 25 + '%'
    }
})

// Discount Wheel
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('wheelModal');
    const canvas = document.getElementById('wheelCanvas');
    const spinBtn = document.getElementById('spinBtn');
    const resultDiv = document.getElementById('result');
    const discountAmount = document.getElementById('discountAmount');
    const claimBtn = document.getElementById('claimBtn');
    const ctx = canvas.getContext('2d');

    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // Show modal only if:
    // 1. User is not logged in
    // 2. Modal hasn't been shown in this session
    // 3. If user is logged in, they haven't claimed a discount before
    let shouldShowModal = false;
    
    if (!loggedInUser) {
        // User not logged in - show if not shown in this session
        if (!localStorage.getItem('discountModalShown')) {
            shouldShowModal = true;
            localStorage.setItem('discountModalShown', 'true');
        }
    } else {
        // User is logged in - never show modal if they have claimed discount
        const user = JSON.parse(loggedInUser);
        if (!user.hasClaimedDiscount && !localStorage.getItem('discountModalShown')) {
            shouldShowModal = true;
            localStorage.setItem('discountModalShown', 'true');
        }
    }
    
    if (shouldShowModal) {
        modal.style.display = 'block';
    }

    // Update the wheel segments with better colors
    const segments = [
        {text: '5%', color: '#FF6B6B', textColor: '#fff'},
        {text: '10%', color: '#4ECDC4', textColor: '#fff'},
        {text: '15%', color: '#45B7D1', textColor: '#fff'},
        {text: '20%', color: '#96CEB4', textColor: '#fff'},
        {text: '25%', color: '#FFEEAD', textColor: '#333'},
        {text: '30%', color: 'var(--primary-color)', textColor: '#fff'}
    ];

    let isSpinning = false;
    let currentRotation = 0;

    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.stroke();

        segments.forEach((segment, i) => {
            const angle = (Math.PI * 2 / segments.length);
            
            // Draw segment
            ctx.beginPath();
            ctx.fillStyle = segment.color;
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, i * angle, (i + 1) * angle);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Add text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(i * angle + angle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = segment.textColor;
            ctx.font = 'bold 20px Poppins';
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 4;
            ctx.fillText(segment.text, radius - 30, 8);
            ctx.restore();
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = 'var(--primary-color)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Update the spin animation
    function spin() {
        if (isSpinning) return;
        isSpinning = true;

        const spins = 8; // Increased number of spins
        const duration = 5000; // Longer duration
        const finalAngle = Math.random() * Math.PI * 2;
        const totalRotation = spins * Math.PI * 2 + finalAngle;
        const startTime = performance.now();

        spinBtn.style.opacity = '0.5';
        spinBtn.style.pointerEvents = 'none';

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Enhanced easing function for more realistic spin
            const easing = 1 - Math.pow(1 - progress, 4);
            
            currentRotation = totalRotation * easing;
            
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(currentRotation);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            drawWheel();
            ctx.restore();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                const winningSegment = segments[Math.floor((totalRotation % (Math.PI * 2)) / (Math.PI * 2 / segments.length))];
                
                // Enhanced winning animation
                resultDiv.style.display = 'block';
                discountAmount.textContent = winningSegment.text;
                spinBtn.style.display = 'none';
                
                // Add confetti effect
                createConfetti();
            }
        }

        requestAnimationFrame(animate);
    }

    // Add confetti effect
    function createConfetti() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9999'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // Initialize wheel
    canvas.width = 300;
    canvas.height = 300;
    drawWheel();

    // Event listeners
    spinBtn.addEventListener('click', spin);
    claimBtn.addEventListener('click', function() {
        // Save the won discount to local storage to be applied after sign up
        const wonDiscount = parseFloat(discountAmount.textContent);
        if (!isNaN(wonDiscount)) {
            localStorage.setItem('pendingDiscount', wonDiscount);
        }
        // Redirect to the sign-up page
        window.location.href = 'signup.html';
    });
});

function applyDiscount(discountPercent) {
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(item => {
        const priceElement = item.querySelector('span');
        if (priceElement) {
            const originalPriceText = priceElement.textContent.replace('$', '');
            // Check if a discount has already been applied by looking for the <del> tag
            if (priceElement.querySelector('del')) return;

            const originalPrice = parseFloat(originalPriceText);
            const discountedPrice = originalPrice * (1 - discountPercent/100);
            priceElement.innerHTML = `<span style="color: var(--primary-color); font-weight: bold;">$${discountedPrice.toFixed(2)}</span> <del style="color: #999; font-size: 0.8em">$${originalPrice.toFixed(2)}</del>`;
        }
    });
}

// Handles showing user profile or auth links based on login state
function handleAuthState() {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    const authLinks = document.querySelectorAll('.auth-link');
    const userProfile = document.querySelector('.user-profile');

    if (loggedInUserString) {
        let loggedInUser = JSON.parse(loggedInUserString);
        const usernameSpan = document.getElementById('username');
        const signoutBtn = document.getElementById('signout-btn');
        // User is "logged in"
        authLinks.forEach(link => link.style.display = 'none');
        userProfile.style.display = 'flex';
        usernameSpan.textContent = loggedInUser.name;

        signoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            // Clean up session-specific modal flag on sign out
            localStorage.removeItem('discountModalShown');
            window.location.reload();
        });

        // Check for a pending discount from the wheel
        const pendingDiscount = localStorage.getItem('pendingDiscount');

        // Apply discount ONLY if it's pending AND this user hasn't already claimed a discount
        if (pendingDiscount && !loggedInUser.hasClaimedDiscount) {
            applyDiscount(parseFloat(pendingDiscount));
            showNotification(`Welcome, ${loggedInUser.name}! Your ${pendingDiscount}% discount has been applied.`);
            
            // Update the user object to mark the discount as claimed
            loggedInUser.hasClaimedDiscount = true;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            // Remove the pending discount as it has now been tied to the account and applied
            localStorage.removeItem('pendingDiscount');
        }
    } else {
        // User is not logged in
        authLinks.forEach(link => link.style.display = 'block');
        userProfile.style.display = 'none';
    }
}


// Cart functionality
let cart = [];

function initializeCart() {
    const cartBtns = document.querySelectorAll('.cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Show cart when main cart icon is clicked
    document.querySelector('.right-menu .cart-btn').addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
    
    // Hide cart
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Add to cart functionality for each food item
    cartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const foodItem = this.closest('.food-item');
            if (foodItem) {
                const itemName = foodItem.querySelector('h3').textContent;
                const itemPriceText = foodItem.querySelector('span').textContent;
                // Get original price from the <del> tag if it exists, otherwise use the main price
                const delElement = foodItem.querySelector('span del');
                const price = delElement ? parseFloat(delElement.textContent.replace('$', '')) : parseFloat(itemPriceText.replace('$', ''));
                
                const itemImg = foodItem.querySelector('.img-holder').style.backgroundImage.replace(/url\(['"](.+)['"]\)/, '$1');
                
                addToCart({
                    name: itemName,
                    price: price,
                    image: itemImg,
                    quantity: 1
                });
                
                // Show success message
                showNotification(`${itemName} added to cart!`);
                
                // Open cart sidebar
                cartSidebar.classList.add('active');
            }
        });
    });
    
    // Checkout button functionality
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            showNotification('Your cart is empty!');
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function addToCart(item) {
    const existingItem = cart.find(i => i.name === item.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    
    updateCartDisplay();
    saveCartToLocalStorage();
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.getElementById('cart-total-amount');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart('${item.name}')" class="remove-item">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(itemName, change) {
    const item = cart.find(i => i.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemName);
        } else {
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
    saveCartToLocalStorage();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Initialize cart and auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    loadCartFromLocalStorage();
    handleAuthState();
});