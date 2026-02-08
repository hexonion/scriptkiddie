// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initPreloader();
    initCustomCursor();
    initScrollProgress();
    initScrollAnimations();
    initParallaxEffects();
    initFloatingElements();
    initCountdownTimer();
    initAnimatedCounters();
    initNavigation();
    initCardHoverEffects();
    initClickEffects();
});

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    // Минимальное время показа прелоадера (1.5 секунды)
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Показываем контент после скрытия прелоадера
        setTimeout(() => {
            contentWrapper.style.opacity = '1';
        }, 300);
        
        // Удаляем прелоадер из DOM после анимации
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }, 1500);
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Если устройство не поддерживает курсор (тачскрин), скрываем кастомный курсор
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.documentElement.style.cursor = 'auto';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Скорость следования outline за dot
    const speed = 0.1;
    
    // Обновление позиции курсора
    function updateCursor(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Немедленное обновление точки
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
    
    // Плавное движение outline
    function animateOutline() {
        // Интерполяция для плавного движения
        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    
    // Эффекты при наведении на интерактивные элементы
    function handleCursorEffects() {
        // Все интерактивные элементы
        const interactiveElements = document.querySelectorAll(
            'a, button, .event-card, .artist-card, .tagger-btn, .scroll-indicator, .social-link, .footer-link'
        );
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(1.5)';
                cursorOutline.style.transform = 'scale(1.2)';
                cursorOutline.style.borderColor = 'var(--accent)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
                cursorOutline.style.borderColor = 'var(--accent-light)';
            });
        });
    }
    
    // Инициализация
    document.addEventListener('mousemove', updateCursor);
    requestAnimationFrame(animateOutline);
    handleCursorEffects();
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function updateProgress() {
        // Высота страницы
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        
        // Текущая позиция скролла
        const scrolled = window.pageYOffset;
        
        // Процент прокрутки
        const progress = (scrolled / documentHeight) * 100;
        
        // Обновление ширины прогресс-бара
        scrollProgress.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Инициализация
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Настройки для Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Создаем observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем задержку для staggered эффекта
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                
                // Перестаем наблюдать за элементом после появления
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Начинаем наблюдение за каждым элементом
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    // Проверяем, поддерживает ли устройство параллакс (не мобильное)
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    
    if (isMobile) {
        // На мобильных отключаем параллакс для производительности
        parallaxElements.forEach(el => {
            el.style.backgroundAttachment = 'scroll';
        });
        return;
    }
    
    function updateParallax() {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            
            // Параллакс эффект
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            
            // Изменение прозрачности для глубины
            const opacity = 0.05 + (window.pageYOffset / window.innerHeight * 0.02);
            element.style.opacity = Math.min(opacity, 0.08).toFixed(2);
        });
    }
    
    // Используем requestAnimationFrame для плавности
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    updateParallax(); // Инициализация
}

// ===== FLOATING ELEMENTS =====
function initFloatingElements() {
    const floatingElems = document.querySelectorAll('.floating-element');
    
    // Устанавливаем случайные параметры анимации
    floatingElems.forEach(elem => {
        const randomDelay = Math.random() * 5;
        const randomDuration = 15 + Math.random() * 10;
        const randomSpeed = (0.1 + Math.random() * 0.3).toFixed(2);
        
        elem.style.animationDelay = `${randomDelay}s`;
        elem.style.animationDuration = `${randomDuration}s`;
        elem.dataset.speed = randomSpeed;
        
        // Добавляем параллакс для плавающих элементов
        elem.style.transition = 'transform 0.1s linear';
    });
    
    // Параллакс для плавающих элементов
    function updateFloatingParallax() {
        const scrollY = window.pageYOffset;
        
        floatingElems.forEach(elem => {
            const speed = parseFloat(elem.dataset.speed) || 0.2;
            const yPos = -(scrollY * speed);
            const rotation = scrollY * 0.01;
            
            elem.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
        });
    }
    
    // Оптимизированное обновление
    let floatTicking = false;
    
    function onFloatScroll() {
        if (!floatTicking) {
            requestAnimationFrame(() => {
                updateFloatingParallax();
                floatTicking = false;
            });
            floatTicking = true;
        }
    }
    
    window.addEventListener('scroll', onFloatScroll);
    updateFloatingParallax(); // Инициализация
}

// ===== COUNTDOWN TIMER =====
function initCountdownTimer() {
    // Дата следующего концерта (2 февраля 2026)
    const nextConcertDate = new Date('February 2, 2026 21:00:00').getTime();
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = nextConcertDate - now;
        
        if (timeLeft < 0) {
            // Если время прошло, показываем сообщение
            Object.values(countdownElements).forEach(el => {
                el.textContent = '00';
            });
            return;
        }
        
        // Расчет дней, часов, минут, секунд
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Обновление элементов с добавлением ведущего нуля
        countdownElements.days.textContent = days.toString().padStart(2, '0');
        countdownElements.hours.textContent = hours.toString().padStart(2, '0');
        countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
        countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Обновляем каждую секунду
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Инициализация
    
    // Очистка интервала при размонтировании (если будет SPA)
    window.addEventListener('beforeunload', () => {
        clearInterval(countdownInterval);
    });
}

// ===== ANIMATED COUNTERS =====
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    // Проверяем, виден ли элемент на экране
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                const duration = 2000; // 2 секунды
                const step = Math.ceil(target / (duration / 16)); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current > target) {
                        current = target;
                    }
                    
                    counter.textContent = current;
                    
                    if (current < target) {
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    // Плавная прокрутка для ссылок с якорями
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Рассчитываем offset с учетом фиксированных элементов
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Обработка клика на индикатор скролла
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Активное состояние для навигационных ссылок при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.footer-link');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Инициализация
}

// ===== CARD HOVER EFFECTS =====
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.event-card, .artist-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Добавляем легкую тряску
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.animation = 'none';
        });
    });
    
    // Добавляем CSS анимацию тряски
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0) rotate(0); }
            25% { transform: translateX(-2px) rotate(-0.5deg); }
            75% { transform: translateX(2px) rotate(0.5deg); }
        }
    `;
    document.head.appendChild(style);
}

// ===== CLICK EFFECTS =====
function initClickEffects() {
    // Эффект пульсации при клике на кнопки
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tagger-btn') || e.target.closest('.scroll-indicator')) {
            createRippleEffect(e);
        }
    });
    
    function createRippleEffect(event) {
        const button = event.target.closest('a, button, .scroll-indicator');
        if (!button) return;
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        
        // Добавляем стили для ripple
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Удаляем ripple после анимации
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Добавляем CSS анимацию для ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== WINDOW RESIZE HANDLER =====
function handleResize() {
    // При ресайзе переинициализируем параллакс (если нужно)
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach(el => {
        el.style.backgroundAttachment = isMobile ? 'scroll' : 'fixed';
    });
    
    // Переинициализируем курсор на мобильных
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.documentElement.style.cursor = 'auto';
    } else {
        cursorDot.style.display = 'block';
        cursorOutline.style.display = 'block';
        document.documentElement.style.cursor = 'none';
    }
}

// Обработчик изменения размера окна
window.addEventListener('resize', handleResize);

// ===== PERFORMANCE OPTIMIZATIONS =====
// Откладываем загрузку некоторых элементов
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Инициализируем ленивую загрузку при загрузке DOM
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    // Можно добавить отправку ошибок на сервер или показать пользователю
});

// ===== TOUCH DEVICE SUPPORT =====
// Добавляем поддержку touch событий для мобильных устройств
document.addEventListener('touchstart', function() {
    // Добавляем класс touch-device для CSS корректировок
    document.body.classList.add('touch-device');
}, { once: true });