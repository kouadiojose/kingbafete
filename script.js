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
    // Dynamic Content Loading from JSON
    // =========================================
    function initDynamicContent() {
        var API_BASE = '/api/data';

        function escHtml(text) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Category icons for gallery
        var categoryIcons = {
            evenements: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
            livres: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
            communaute: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            medias: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>'
        };

        var categoryLabels = { evenements: 'Événement', livres: 'Livres', communaute: 'Communauté', medias: 'Médias' };

        // Load Gallery
        fetch(API_BASE + '/gallery').then(function (r) { return r.json(); }).then(function (gallery) {
            var grid = document.getElementById('gallery-grid');
            var countEl = document.getElementById('gallery-count');
            if (!grid || !gallery.length) return;

            grid.innerHTML = gallery.map(function (item, i) {
                var sizeClass = item.size === 'wide' ? ' gallery__item--wide' : item.size === 'tall' ? ' gallery__item--tall' : '';
                var icon = categoryIcons[item.category] || categoryIcons.evenements;
                // Use bigger icon for wide items
                if (item.size === 'wide') {
                    icon = icon.replace('width="48"', 'width="64"').replace('height="48"', 'height="64"');
                }

                return '<div class="gallery__item' + sizeClass + '" data-category="' + escHtml(item.category) + '" data-aos="fade-up" data-aos-delay="' + (i * 50) + '">' +
                    '<div class="gallery__image" style="background: linear-gradient(135deg, ' + escHtml(item.color1) + ' 0%, ' + escHtml(item.color2) + ' 100%);">' +
                    '<div class="gallery__image-content">' + icon + '</div>' +
                    '</div>' +
                    '<div class="gallery__overlay">' +
                    '<span class="gallery__category-tag">' + escHtml(categoryLabels[item.category] || item.category) + '</span>' +
                    '<h4 class="gallery__caption">' + escHtml(item.caption) + '</h4>' +
                    '<p class="gallery__date">' + escHtml(item.date) + '</p>' +
                    '</div>' +
                    '<button class="gallery__zoom" aria-label="Agrandir"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg></button>' +
                    '</div>';
            }).join('');

            if (countEl) countEl.textContent = gallery.length;

            // Re-init gallery interactions after dynamic load
            initGallery();
            // Re-init AOS for new elements
            initAnimations();
        }).catch(function () {
            // Silently fail - keep static HTML content
        });

        // Load Blog
        fetch(API_BASE + '/blog').then(function (r) { return r.json(); }).then(function (blog) {
            var blogGrid = document.querySelector('.blog__grid');
            if (!blogGrid || !blog.length) return;

            blogGrid.innerHTML = blog.map(function (article, i) {
                var dateStr = article.date;
                try {
                    var d = new Date(article.date);
                    if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                    }
                } catch (e) { /* keep original */ }

                var isFeatured = i === 0;
                return '<article class="blog-card' + (isFeatured ? ' blog-card--featured' : '') + '" data-aos="fade-up" data-aos-delay="' + (i * 100) + '">' +
                    (isFeatured ? '<div class="blog-card__image"><div class="blog__placeholder"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg></div></div>' : '') +
                    '<div class="blog-card__content">' +
                    '<div class="blog-card__meta">' +
                    '<span class="blog-card__category">' + escHtml(article.category) + '</span>' +
                    '<span class="blog-card__date">' + escHtml(dateStr) + '</span>' +
                    '</div>' +
                    '<h3 class="blog-card__title">' + escHtml(article.title) + '</h3>' +
                    '<p class="blog-card__excerpt">' + escHtml(article.excerpt) + '</p>' +
                    '<a href="#" class="blog-card__link">Lire la suite →</a>' +
                    '</div></article>';
            }).join('');
        }).catch(function () { /* keep static */ });

        // Load About
        fetch(API_BASE + '/about').then(function (r) { return r.json(); }).then(function (about) {
            var highlight = document.querySelector('.intro__highlight');
            var textPs = document.querySelectorAll('.about__text p');
            var counters = document.querySelectorAll('[data-count]');

            if (highlight && about.highlight) highlight.textContent = about.highlight;
            if (textPs.length >= 3) {
                if (about.text1) textPs[0].textContent = about.text1;
                if (about.text2) textPs[1].innerHTML = about.text2.replace('SOFIFRAN', '<strong>SOFIFRAN</strong>');
                if (about.text3) textPs[2].innerHTML = about.text3.replace('SOFIFRAN', '<strong>SOFIFRAN</strong>');
            }
            if (about.stats && about.stats.length >= 3 && counters.length >= 3) {
                counters[0].setAttribute('data-count', about.stats[0].value);
                counters[1].setAttribute('data-count', about.stats[1].value);
                counters[2].setAttribute('data-count', about.stats[2].value);

                var labels = document.querySelectorAll('.stat__label');
                if (labels.length >= 3) {
                    labels[0].textContent = about.stats[0].label;
                    labels[1].textContent = about.stats[1].label;
                    labels[2].textContent = about.stats[2].label;
                }
            }
        }).catch(function () { /* keep static */ });
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
        initDynamicContent();
        initVideoPlayers();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
