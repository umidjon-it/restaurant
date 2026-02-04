// ===== WHATSAPP ORDERING JAVASCRIPT =====
let currentLang = 'ru';
let cart = [];
let slideIndex = 0;
let slideTimer;

// WhatsApp ресторан номери
const RESTAURANT_PHONE = '996555123456'; // Ресторан номери

document.addEventListener('DOMContentLoaded', function() {
    initBurgerMenu();
    initLanguage();
    initMenuFilter();
    initCart();
    initSlideshow();
    loadCart();
    updateCartDisplay();
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

// Slideshow
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
    }, 5000);
}

// Language
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
    // Update text elements
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
    
    // Update placeholders
    document.querySelectorAll('[data-ru-placeholder]').forEach(el => {
        const placeholder = el.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            el.placeholder = placeholder;
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
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sendToWhatsApp();
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
    updateCartDisplay();
    saveCart();
    showNotification(getText('addedToCart'), 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
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

// Send to WhatsApp
function sendToWhatsApp() {
    if (cart.length === 0) {
        showNotification(getText('emptyCart'), 'error');
        return;
    }
    
    const name = document.getElementById('customerName').value;
    const address = document.getElementById('customerAddress').value;
    const comment = document.getElementById('customerComment').value;
    
    if (!name || !address) {
        showNotification(getText('fillFields'), 'error');
        return;
    }
    
    // Формируем сообщение для WhatsApp
    let message = `🍽️ *ЗАКАЗ ИЗ РЕСТОРАНА ШОРО*\n\n`;
    message += `👤 *Имя:* ${name}\n`;
    message += `📍 *Адрес:* ${address}\n\n`;
    message += `📋 *ЗАКАЗ:*\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name} x${item.quantity} = ${itemTotal} сом\n`;
    });
    
    message += `\n💰 *ИТОГО: ${total} сом*\n`;
    
    if (comment) {
        message += `\n💬 *Комментарий:* ${comment}`;
    }
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Открываем WhatsApp
    const whatsappUrl = `https://wa.me/${RESTAURANT_PHONE}?text=${encodedMessage}`;
    
    // Открываем в новом окне
    window.open(whatsappUrl, '_blank');
    
    // Показываем уведомление
    showNotification(getText('redirectingToWhatsApp'), 'success');
    
    // Очищаем корзину после отправки
    setTimeout(() => {
        cart = [];
        updateCartCount();
        updateCartDisplay();
        saveCart();
        document.getElementById('cartModal').classList.remove('show');
        document.getElementById('customerName').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerComment').value = '';
    }, 1000);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// Notification
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
            'ru': 'Укажите имя и адрес!',
            'kg': 'Атты жана даректи көрсөтүңүз!',
            'en': 'Enter name and address!'
        },
        'redirectingToWhatsApp': {
            'ru': 'Переходим в WhatsApp...',
            'kg': 'WhatsApp ка өтүп жатабыз...',
            'en': 'Opening WhatsApp...'
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

console.log('%c🍽️ ШОРО - WhatsApp Ordering', 'color: #25D366; font-size: 22px; font-weight: bold;');
console.log('%c✨ Заказ через WhatsApp за 2 минуты!', 'color: #C17817; font-size: 14px;');