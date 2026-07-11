document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. ЛОГИКА МОБИЛЬНОГО МЕНЮ (БУРГЕР)
    // ==========================================================================
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (burgerBtn && mobileNav) {
        // Открытие/закрытие меню по клику на бургер
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('is-active');
            mobileNav.classList.toggle('is-active');
            // Запрещаем скролл страницы, когда открыто меню
            document.body.classList.toggle('no-scroll'); 
        });

        // Автоматическое закрытие меню при клике на любой пункт
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('is-active');
                mobileNav.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ==========================================================================
    // 2. ЛОГИКА СЛАЙДЕРА (НАШИ УСЛУГИ)
    // ==========================================================================
    const track = document.querySelector('.slider-track');
    const cards = document.querySelectorAll('.service-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    let currentIndex = 0;

    // Функция определяет, сколько карточек сейчас видно на экране по CSS
    function getVisibleCardsCount() {
        const width = window.innerWidth;
        if (width <= 480) return 1;  // Мобильные — 1 карточка
        if (width <= 1024) return 2; // Планшеты — 2 карточки
        return 3;                    // Десктоп — 3 карточки
    }

    // Функция обновления позиции слайдера
    function updateSliderPosition() {
        if (!track || cards.length === 0) return;
        
        const visibleCards = getVisibleCardsCount();
        const maxIndex = cards.length - visibleCards;
        
        // Зацикливание (круговой слайдер)
        if (currentIndex > maxIndex) {
            currentIndex = 0; // Если ушли вперед, возвращаемся в начало
        }
        if (currentIndex < 0) {
            currentIndex = maxIndex; // Если ушли назад, прыгаемся в самый конец
        }

        // Берем физическую ширину одной карточки
        const cardWidth = cards[0].getBoundingClientRect().width;
        // Отступ между карточками (соответствует gap: 24px в CSS)
        const gap = 24; 
        
        // Вычисляем точный сдвиг в пикселях
        const moveAmount = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${moveAmount}px)`;
    }

    // Клик по кнопке "Вперед"
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateSliderPosition();
        });
    }

    // Клик по кнопке "Назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateSliderPosition();
        });
    }

    // Пересчитываем ширину карточек при изменении размеров экрана (умный Resize)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSliderPosition();
        }, 100);
    });

    // Стартовая инициализация позиции слайдера при загрузке
    updateSliderPosition();


    // ==========================================================================
    // 3. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ССЫЛОК (ВКЛЮЧАЯ КНОПКИ)
    // ==========================================================================
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            
            if (id === '#') return;
            
            const targetElement = document.querySelector(id);
            if (targetElement) {
                e.preventDefault();
                
                // Вычисляем высоту шапки, чтобы не перекрывать заголовок секции
                const headerOffset = document.querySelector('.header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // 20px запас

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

       // ==========================================================================
    // 4. ДИНАМИЧЕСКАЯ АНИМАЦИЯ ДВУХСТОРОННЕГО СКРОЛЛА (ПОЯВЛЕНИЕ / УХОД)
    // ==========================================================================
    const animatedElements = document.querySelectorAll('.fade-in-element');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            // Слегка смещаем границу срабатывания (-80px снизу), 
            // чтобы элементы эффектно затухали чуть раньше, чем полностью покинут экран
            rootMargin: '0px 0px -80px 0px', 
            threshold: 0.1 // Срабатывает, когда видно хотя бы 10% блока
        };

        const appearanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Элемент входит в зону видимости — плавно показываем
                    entry.target.classList.add('is-visible');
                } else {
                    // Проверяем, ушел ли элемент именно НАВЕРХ (координата top стала отрицательной)
                    // Если проскроллили мимо блока вверх, мягко прячем его обратно
                    if (entry.boundingClientRect.top < 0) {
                        entry.target.classList.remove('is-visible');
                    }
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            appearanceObserver.observe(element);
        });
    }
