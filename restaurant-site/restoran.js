// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentLang = 'ru';

// ===== ПЕРЕВОДЫ =====
const translations = {
    ru: {},
    kg: {}
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function () {
    initBurgerMenu();
    initLanguageSwitcher();
    initMenuFilter();
    initSmoothScroll();
    initOrderButtons();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
});

// ===== БУРГЕР МЕНЮ =====
function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ===== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА =====
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');

            if (lang === currentLang) return;

            // Обновляем активную кнопку
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Меняем язык
            currentLang = lang;
            updateLanguage(lang);

            // Анимация переключения
            document.body.style.opacity = '0.7';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 200);
        });
    });
}

function updateLanguage(lang) {
    // Находим все элементы с переводами
    const elements = document.querySelectorAll('[data-ru][data-kg]');

    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);

        if (text) {
            // Проверяем тип элемента
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Сохраняем выбранный язык
    localStorage.setItem('selectedLanguage', lang);
}

// Загрузка сохраненного языка
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('selectedLanguage');

    if (savedLang && savedLang !== currentLang) {
        const langBtn = document.querySelector(`[data-lang="${savedLang}"]`);
        if (langBtn) {
            langBtn.click();
        }
    }
});

// ===== ФИЛЬТР МЕНЮ =====
function initMenuFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // Обновляем активную кнопку
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Фильтруем карточки
            filterMenuItems(category, menuCards);
        });
    });
}

function filterMenuItems(category, cards) {
    cards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hide');
            // Анимация появления с задержкой
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeIn 0.5s ease ${index * 0.05}s forwards`;
            }, 10);
        } else {
            card.classList.add('hide');
        }
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== КНОПКИ ЗАКАЗА =====
function initOrderButtons() {
    const orderButtons = document.querySelectorAll('.order-btn');

    orderButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Получаем название блюда
            const menuCard = this.closest('.menu-card');
            const dishName = menuCard.querySelector('h3').textContent;
            const dishPrice = menuCard.querySelector('.price').textContent;

            // Заполняем форму
            const messageField = document.getElementById('message');
            const currentText = messageField.value;
            const newText = currentText
                ? `${currentText}\n${dishName} - ${dishPrice}`
                : `${dishName} - ${dishPrice}`;

            messageField.value = newText;

            // Прокручиваем к форме
            const contactSection = document.getElementById('contact');
            const headerHeight = document.getElementById('header').offsetHeight;

            window.scrollTo({
                top: contactSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });

            // Показываем уведомление
            showNotification(currentLang === 'ru'
                ? 'Блюдо добавлено в заказ!'
                : 'Тамак заказга кошулду!');
        });
    });
}

// ===== ОБРАБОТКА ФОРМЫ =====
function initContactForm() {
    const form = document.getElementById('orderForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Получаем данные формы
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Валидация
        if (!name || !phone || !message) {
            showNotification(currentLang === 'ru'
                ? 'Пожалуйста, заполните все поля!'
                : 'Суранам, бардык талааларды толтуруңуз!', 'error');
            return;
        }

        // Валидация телефона
        if (phone.length < 10) {
            showNotification(currentLang === 'ru'
                ? 'Введите корректный номер телефона!'
                : 'Туура телефон номерин киргизиңиз!', 'error');
            return;
        }

        // Имитация отправки
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'ru' ? 'Отправка...' : 'Жөнөтүлүүдө...';

        // Симуляция отправки на сервер
        setTimeout(() => {
            showNotification(currentLang === 'ru'
                ? 'Спасибо! Ваш заказ принят. Мы свяжемся с вами в ближайшее время.'
                : 'Рахмат! Сиздин заказыңыз кабыл алынды. Биз сиз менен жакын арада байланышабыз.', 'success');

            // Очистка формы
            form.reset();

            // Восстановление кнопки
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    });

    // Форматирование телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (!value.startsWith('996') && value.length > 0) {
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
            if (value.length > 8) {
                formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9);
            }
            e.target.value = formatted;
        }
    });
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'success') {
    // Удаляем старое уведомление
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Удаляем через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
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

// ===== АНИМАЦИЯ ПРИ ПРОКРУТКЕ =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за секциями
    const sections = document.querySelectorAll('.about, .menu, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// ===== ИЗМЕНЕНИЕ HEADER ПРИ ПРОКРУТКЕ =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.3)';
        }

        // Скрытие header при прокрутке вниз (опционально)
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ===== ПАРАЛЛАКС ЭФФЕКТ =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== ПРЕДЗАГРУЗКА =====
window.addEventListener('load', () => {
    // Убираем loader если есть
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }

    // Показываем контент
    document.body.style.opacity = '1';
});

// ===== КОНСОЛЬ =====
console.log('%c🍽️ Добро пожаловать в ресторан ШОРО!', 'color: #D4611A; font-size: 20px; font-weight: bold;');
console.log('%cСайт разработан с любовью ❤️', 'color: #F4A460; font-size: 14px;');
