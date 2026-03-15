/**
 * King Bafété - Interactive Website JavaScript
 * Modern, fluid interactions for African storytelling
 */

(function() {
    'use strict';

    // =========================================
    // Configuration
    // =========================================
    const CONFIG = {
        scrollThreshold: 100,
        animationDelay: 100,
        particleCount: 30,
        counterDuration: 2000
    };

    // =========================================
    // DOM Elements
    // =========================================
    const elements = {
        preloader: document.getElementById('preloader'),
        header: document.getElementById('header'),
        navToggle: document.getElementById('nav-toggle'),
        navClose: document.getElementById('nav-close'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav__link'),
        backToTop: document.getElementById('backToTop'),
        contactForm: document.getElementById('contact-form'),
        particles: document.getElementById('particles'),
        counters: document.querySelectorAll('[data-count]'),
        aosElements: document.querySelectorAll('[data-aos]')
    };

    // =========================================
    // Preloader
    // =========================================
    function initPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                elements.preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
                initAnimations();
            }, 800);
        });
    }

    // =========================================
    // Header Scroll Effect
    // =========================================
    function initHeaderScroll() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > CONFIG.scrollThreshold) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // =========================================
    // Mobile Navigation
    // =========================================
    function initMobileNav() {
        // Open menu
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', () => {
                elements.navMenu.classList.add('show-menu');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close menu
        if (elements.navClose) {
            elements.navClose.addEventListener('click', closeMenu);
        }

        // Close on link click
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
                updateActiveLink(link);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (elements.navMenu.classList.contains('show-menu') &&
                !elements.navMenu.contains(e.target) &&
                !elements.navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        function closeMenu() {
            elements.navMenu.classList.remove('show-menu');
            document.body.style.overflow = 'visible';
        }
    }

    // =========================================
    // Active Navigation Link
    // =========================================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');

        function updateNav() {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 150;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', throttle(updateNav, 100));
    }

    function updateActiveLink(clickedLink) {
        elements.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    // =========================================
    // Smooth Scroll
    // =========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // =========================================
    // Back to Top Button
    // =========================================
    function initBackToTop() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
        });

        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // Particles Animation (Hero)
    // =========================================
    function initParticles() {
        if (!elements.particles) return;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '0';

        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random animation
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.animationDelay = Math.random() * 4 + 's';

        elements.particles.appendChild(particle);

        // Remove and recreate
        particle.addEventListener('animationiteration', () => {
            particle.style.left = Math.random() * 100 + '%';
        });
    }

    // =========================================
    // Scroll Animations (AOS-like)
    // =========================================
    function initAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.aosElements.forEach(el => observer.observe(el));
    }

    // =========================================
    // Counter Animation
    // =========================================
    function initCounters() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = CONFIG.counterDuration;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num + '+';
    }

    // =========================================
    // Contact Form
    // =========================================
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Show loading state
            btn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <span>Envoi en cours...</span>
            `;
            btn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Show success
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Message envoyé!</span>
                `;
                btn.style.background = '#27ae60';

                // Reset form
                this.reset();

                // Reset button after delay
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);

            }, 2000);
        });

        // Floating labels enhancement
        const inputs = elements.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // =========================================
    // Parallax Effect (Hero)
    // =========================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero__content');

            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    // =========================================
    // Image Lazy Loading
    // =========================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // =========================================
    // Keyboard Navigation
    // =========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape' && elements.navMenu.classList.contains('show-menu')) {
                elements.navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'visible';
            }
        });
    }

    // =========================================
    // Utility Functions
    // =========================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // =========================================
    // Cursor Effect (Desktop)
    // =========================================
    function initCursorEffect() {
        // Only on desktop
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
        document.body.appendChild(cursor);

        const dot = cursor.querySelector('.cursor-dot');
        const outline = cursor.querySelector('.cursor-outline');

        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            dot.style.left = cursorX + 'px';
            dot.style.top = cursorY + 'px';
        });

        // Smooth outline follow
        function animateOutline() {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;

            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';

            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .book-card, .interview-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });

        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                pointer-events: none;
                position: fixed;
                z-index: 9999;
            }
            .cursor-dot {
                width: 8px;
                height: 8px;
                background: var(--color-primary);
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            .cursor-outline {
                width: 40px;
                height: 40px;
                border: 2px solid var(--color-primary);
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                opacity: 0.5;
                transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
            }
            .cursor-hover .cursor-dot {
                transform: translate(-50%, -50%) scale(1.5);
            }
            .cursor-hover .cursor-outline {
                width: 60px;
                height: 60px;
                opacity: 0.3;
            }
            @media (max-width: 1024px) {
                .custom-cursor { display: none; }
            }
        `;
        document.head.appendChild(style);
    }

    // =========================================
    // Gallery Filters & Lightbox
    // =========================================
    function initGallery() {
        const filters = document.querySelectorAll('.gallery__filter');
        const items = document.querySelectorAll('.gallery__item');
        const countEl = document.getElementById('gallery-count');

        if (!filters.length) return;

        // Filter functionality
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                const category = filter.dataset.filter;
                let visibleCount = 0;

                items.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        item.classList.add('hidden');
                    }
                });

                if (countEl) {
                    countEl.textContent = visibleCount;
                }
            });
        });

        // Lightbox functionality
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const backdrop = lightbox.querySelector('.lightbox__backdrop');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        const imageContainer = document.getElementById('lightbox-image');
        const infoEl = document.getElementById('lightbox-info');
        const currentEl = document.getElementById('lightbox-current');
        const totalEl = document.getElementById('lightbox-total');

        let currentIndex = 0;
        let visibleItems = [];

        function getVisibleItems() {
            return Array.from(items).filter(item => !item.classList.contains('hidden'));
        }

        function openLightbox(index) {
            visibleItems = getVisibleItems();
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'visible';
        }

        function updateLightbox() {
            const item = visibleItems[currentIndex];
            if (!item) return;

            const imageDiv = item.querySelector('.gallery__image');
            const caption = item.querySelector('.gallery__caption');
            const date = item.querySelector('.gallery__date');
            const tag = item.querySelector('.gallery__category-tag');

            if (imageDiv && imageContainer) {
                imageContainer.style.background = imageDiv.style.background;
                const svgClone = imageDiv.querySelector('svg');
                if (svgClone) {
                    imageContainer.innerHTML = '';
                    const clone = svgClone.cloneNode(true);
                    clone.setAttribute('width', '96');
                    clone.setAttribute('height', '96');
                    imageContainer.appendChild(clone);
                }
            }

            if (infoEl) {
                const tagEl = infoEl.querySelector('.lightbox__tag');
                const titleEl = infoEl.querySelector('.lightbox__title');
                const dateEl = infoEl.querySelector('.lightbox__date');

                if (tagEl && tag) tagEl.textContent = tag.textContent;
                if (titleEl && caption) titleEl.textContent = caption.textContent;
                if (dateEl && date) dateEl.textContent = date.textContent;
            }

            if (currentEl) currentEl.textContent = currentIndex + 1;
            if (totalEl) totalEl.textContent = visibleItems.length;
        }

        function navigate(direction) {
            currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
            updateLightbox();
        }

        // Open lightbox on item click or zoom button click
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                const visItems = getVisibleItems();
                const visIndex = visItems.indexOf(item);
                if (visIndex !== -1) openLightbox(visIndex);
            });
        });

        // Close
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);

        // Navigation
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    // =========================================
    // Video Play Buttons
    // =========================================
    function initVideoPlayers() {
        const playButtons = document.querySelectorAll('.play-button');

        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Here you would typically open a modal with the video
                // For now, just a visual feedback
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    btn.style.transform = '';
                    alert('Fonctionnalité vidéo à venir. Les vidéos seront intégrées prochainement.');
                }, 150);
            });
        });
    }

    // =========================================
    // Initialize Everything
    // =========================================
    function init() {
        initPreloader();
        initHeaderScroll();
        initMobileNav();
        initActiveNavLink();
        initSmoothScroll();
        initBackToTop();
        initParticles();
        initCounters();
        initContactForm();
        initParallax();
        initLazyLoading();
        initKeyboardNav();
        initCursorEffect();
        initGallery();
        initVideoPlayers();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
