// ===== VACANCIES PAGE JAVASCRIPT =====

let selectedVacancy = '';

// Open Contact with selected vacancy
function openContact(vacancy) {
    selectedVacancy = vacancy;
    
    // Scroll to contact section
    document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    // Highlight contact methods
    setTimeout(() => {
        const contactMethods = document.querySelector('.contact-methods');
        contactMethods.style.animation = 'pulse 1s ease';
    }, 500);
}

// Show Email Modal
function showEmailModal() {
    const emailModal = document.getElementById('emailModal');
    emailModal.classList.add('show');
    
    if (selectedVacancy) {
        document.getElementById('emailVacancy').value = selectedVacancy;
    }
}

// Close Email Modal
function closeEmailModal() {
    const emailModal = document.getElementById('emailModal');
    emailModal.classList.remove('show');
}

// Close Success Modal
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('show');
}

// Email Form Submit
document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('emailName').value;
    const phone = document.getElementById('emailPhone').value;
    const email = document.getElementById('emailEmail').value;
    const vacancy = document.getElementById('emailVacancy').value;
    const message = document.getElementById('emailMessage').value;
    
    if (!name || !phone || !email || !message) {
        showNotification('Заполните все поля!', 'error');
        return;
    }
    
    // Show success
    closeEmailModal();
    const successModal = document.getElementById('successModal');
    successModal.classList.add('show');
    
    // Reset form
    this.reset();
    
    console.log('Заявка отправлена:', { name, phone, email, vacancy, message });
});

// Phone formatting
document.getElementById('emailPhone').addEventListener('input', function(e) {
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
});

// Notification System
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

// Close modals on outside click
document.getElementById('emailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeEmailModal();
    }
});

document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSuccessModal();
    }
});

// Smooth scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add animations
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
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Scroll animations for vacancy cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.vacancy-card, .benefit-card, .contact-card').forEach(card => {
    observer.observe(card);
});

console.log('%c💼 Вакансии ШОРО', 'color: #C17817; font-size: 22px; font-weight: bold;');
console.log('%c✨ Присоединяйтесь к нашей команде!', 'color: #E8A550; font-size: 14px;');