// ===== FINAL JAVASCRIPT =====
let currentLang = 'ru';
let cart = [];
let selectedPayment = 'cash';
let slideIndex = 0;
let slideTimer;

document.addEventListener('DOMContentLoaded', function() {
    initBurgerMenu();
    initLanguage();
    initMenuFilter();
    initCart();
    initForms();
    initSlideshow();
    loadCart();
    updateOrderTotal();
});

// Burger Menu
function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    
    if (!burger || !navLinks) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Slideshow System
function initSlideshow() {
    showSlide(slideIndex);
    startAutoSlide();
}

function showSlide(n) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }
}

function changeSlide(n) {
    clearTimeout(slideTimer);
    slideIndex += n;
    showSlide(slideIndex);
    startAutoSlide();
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    slideIndex = n;
    showSlide(slideIndex);
    startAutoSlide();
}

function startAutoSlide() {
    slideTimer = setTimeout(() => {
        slideIndex++;
        showSlide(slideIndex);
        startAutoSlide();
    }, 5000); // 5 секунд
}

// Language Switcher
function initLanguage() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return;
            
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentLang = lang;
            updateLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
    
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
        const btn = document.querySelector(`[data-lang="${savedLang}"]`);
        if (btn) btn.click();
    }
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-ru][data-kg][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });
}

// Menu Filter
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dishes = document.querySelectorAll('.dish-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            dishes.forEach(dish => {
                const dishCategory = dish.getAttribute('data-category');
                if (category === 'all' || dishCategory === category) {
                    dish.classList.remove('hide');
                } else {
                    dish.classList.add('hide');
                }
            });
        });
    });
}

// Cart System
function initCart() {
    const cartBadge = document.getElementById('cartBadge');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addButtons = document.querySelectorAll('.add-btn');
    
    if (!cartBadge) return;
    
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.dish-card');
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));
            addToCart(name, price);
        });
    });
    
    cartBadge.addEventListener('click', () => {
        cartModal.classList.add('show');
        updateCartDisplay();
    });
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('show');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification(getText('emptyCart'), 'error');
                return;
            }
            cartModal.classList.remove('show');
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartCount();
    updateOrderTotal();
    saveCart();
    showNotification(getText('addedToCart'), 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    updateOrderTotal();
    saveCart();
}

function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartCount();
        updateCartDisplay();
        updateOrderTotal();
        saveCart();
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.querySelector('.total-price');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">${getText('cartEmpty')}</p>`;
        totalPrice.textContent = '0 сом';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} × ${item.quantity} = ${itemTotal} сом</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="font-weight: 700; font-size: 1.1rem;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="qty-btn" onclick="removeFromCart(${index})">×</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    totalPrice.textContent = `${total} сом`;
}

function updateOrderTotal() {
    const orderTotal = document.getElementById('orderTotal');
    if (orderTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotal.textContent = `${total} сом`;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
        updateOrderTotal();
    }
}

// Forms
function initForms() {
    const orderForm = document.getElementById('orderForm');
    const paymentModal = document.getElementById('paymentModal');
    const paymentForm = document.getElementById('paymentForm');
    const successModal = document.getElementById('successModal');
    const vacancyModal = document.getElementById('vacancyModal');
    const vacancyForm = document.getElementById('vacancyForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
    if (vacancyForm) {
        vacancyForm.addEventListener('submit', handleVacancySubmit);
    }
    
    const closePayment = document.getElementById('closePayment');
    if (closePayment) {
        closePayment.addEventListener('click', () => {
            paymentModal.classList.remove('show');
        });
    }
    
    const closeSuccess = document.getElementById('closeSuccess');
    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            successModal.classList.remove('show');
        });
    }
    
    const closeVacancy = document.getElementById('closeVacancy');
    if (closeVacancy) {
        closeVacancy.addEventListener('click', () => {
            vacancyModal.classList.remove('show');
        });
    }
    
    // Apply buttons
    document.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            vacancyModal.classList.add('show');
        });
    });
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhone);
    }
    
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }
    
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', formatExpiry);
    }
    
    const vacancyPhone = document.getElementById('vacancyPhone');
    if (vacancyPhone) {
        vacancyPhone.addEventListener('input', formatPhone);
    }
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    
    if (!name || !phone || !address) {
        showNotification(getText('fillFields'), 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification(getText('emptyCart'), 'error');
        return;
    }
    
    selectedPayment = payment;
    
    if (payment === 'mbank' || payment === 'obank') {
        const paymentModal = document.getElementById('paymentModal');
        const paymentTitle = document.getElementById('paymentTitle');
        
        const bankName = payment === 'mbank' ? 'M Bank' : 'O! Bank';
        paymentTitle.textContent = bankName;
        paymentModal.classList.add('show');
    } else {
        completeOrder();
    }
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
        showNotification(getText('fillFields'), 'error');
        return;
    }
    
    const btn = e.target.querySelector('.pay-btn');
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = getText('processing');
    
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        
        document.getElementById('paymentModal').classList.remove('show');
        completeOrder();
    }, 2000);
}

function handleVacancySubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('vacancyName').value;
    const phone = document.getElementById('vacancyPhone').value;
    const exp = document.getElementById('vacancyExp').value;
    
    if (!name || !phone || !exp) {
        showNotification(getText('fillFields'), 'error');
        return;
    }
    
    showNotification(getText('vacancySuccess'), 'success');
    document.getElementById('vacancyModal').classList.remove('show');
    e.target.reset();
}

function completeOrder() {
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    successModal.classList.add('show');
    
    let message = getText('orderSuccess');
    successMessage.textContent = message;
    
    cart = [];
    updateCartCount();
    updateOrderTotal();
    saveCart();
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) orderForm.reset();
}

// Formatting
function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (!value.startsWith('996')) {
        value = '996' + value;
    }
    
    if (value.length > 12) {
        value = value.slice(0, 12);
    }
    
    if (value.length > 0) {
        let formatted = '+' + value;
        if (value.length > 3) {
            formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3);
        }
        if (value.length > 6) {
            formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
        }
        e.target.value = formatted;
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    let formatted = value.match(/.{1,4}/g);
    e.target.value = formatted ? formatted.join(' ') : value;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

// Notifications
function showNotification(message, type = 'success') {
    const old = document.querySelector('.notification');
    if (old) old.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1.2rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.4s ease;
        font-weight: 600;
        font-size: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Translations
function getText(key) {
    const texts = {
        'emptyCart': {
            'ru': 'Корзина пуста!',
            'kg': 'Себет бош!',
            'en': 'Cart is empty!'
        },
        'addedToCart': {
            'ru': 'Добавлено в корзину!',
            'kg': 'Себетке кошулду!',
            'en': 'Added to cart!'
        },
        'cartEmpty': {
            'ru': 'Корзина пуста',
            'kg': 'Себет бош',
            'en': 'Cart is empty'
        },
        'fillFields': {
            'ru': 'Заполните все поля!',
            'kg': 'Бардык талааларды толтуруңуз!',
            'en': 'Fill all fields!'
        },
        'processing': {
            'ru': 'Обработка...',
            'kg': 'Иштетилүүдө...',
            'en': 'Processing...'
        },
        'orderSuccess': {
            'ru': 'Заказ принят! Доставка в течение 45 минут.',
            'kg': 'Заказ кабыл алынды! 45 мүнөттө жеткирүү.',
            'en': 'Order accepted! Delivery within 45 minutes.'
        },
        'vacancySuccess': {
            'ru': 'Спасибо! Мы свяжемся с вами.',
            'kg': 'Рахмат! Биз сиз менен байланышабыз.',
            'en': 'Thank you! We will contact you.'
        }
    };
    
    return texts[key] ? texts[key][currentLang] : key;
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('%c🍽️ ШОРО Ресторан', 'color: #C17817; font-size: 22px; font-weight: bold;');
console.log('%c✨ Финальная версия | 21 блюдо | Новости | Вакансии', 'color: #E8A550; font-size: 13px;');