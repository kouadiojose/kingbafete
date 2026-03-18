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

            // Send to API
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const form = this;

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(res => res.json())
            .then(result => {
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Message envoyé!</span>
                `;
                btn.style.background = '#27ae60';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            })
            .catch(() => {
                btn.innerHTML = '<span>Erreur, réessayez</span>';
                btn.style.background = '#e74c3c';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            });
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
    // Dynamic Content Loading from API
    // =========================================
    function getYouTubeEmbedUrl(url) {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? 'https://www.youtube.com/embed/' + match[1] : url;
    }

    async function loadSettings() {
        try {
            const settings = await fetch('/api/settings').then(r => r.json());

            // Hero section
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle && settings.heroTitle) {
                heroTitle.innerHTML = settings.heroTitle.replace(/\n/g, '<br>');
            }
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroSubtitle && settings.heroSubtitle) {
                heroSubtitle.textContent = settings.heroSubtitle;
            }
            const heroMotto = document.getElementById('hero-motto');
            if (heroMotto && settings.motto) {
                heroMotto.textContent = `"${settings.motto}"`;
            }

            // Logo / Site name
            const siteLogo = document.getElementById('site-logo');
            if (siteLogo && settings.siteName) {
                siteLogo.textContent = settings.siteName;
            }
            const siteLogoImg = document.getElementById('site-logo-img');
            if (siteLogoImg && settings.logoUrl) {
                siteLogoImg.src = settings.logoUrl;
                siteLogoImg.alt = settings.siteName || 'Logo';
                siteLogoImg.style.display = 'inline-block';
            }
            const footerLogo = document.getElementById('footer-logo');
            if (footerLogo && settings.siteName) {
                footerLogo.textContent = settings.siteName;
            }

            // About section
            const aboutTitle = document.getElementById('about-title');
            if (aboutTitle && settings.aboutTitle) {
                aboutTitle.textContent = settings.aboutTitle;
            }
            const aboutPhoto = document.getElementById('about-photo');
            if (aboutPhoto && settings.aboutPhoto) {
                aboutPhoto.src = settings.aboutPhoto;
            }
            const aboutIntro = document.getElementById('about-intro');
            if (aboutIntro && settings.aboutIntro) {
                aboutIntro.innerHTML = `<p class="intro__highlight">${settings.aboutIntro}</p>`;
            }
            const aboutText = document.getElementById('about-text');
            if (aboutText && settings.aboutText) {
                aboutText.innerHTML = settings.aboutText.split('\n\n').map(p => `<p>${p}</p>`).join('');
            }

            // Badge
            const badgeYear = document.getElementById('badge-year');
            if (badgeYear && settings.badgeYear) {
                badgeYear.textContent = settings.badgeYear;
            }
            const badgeText = document.getElementById('badge-text');
            if (badgeText && settings.badgeText) {
                badgeText.textContent = settings.badgeText;
            }

            // Books description
            const booksDesc = document.getElementById('books-description');
            if (booksDesc && settings.booksDescription) {
                booksDesc.textContent = settings.booksDescription;
            }

            // Contact info
            const contactEmail = document.getElementById('contact-email');
            if (contactEmail && settings.contactEmail) {
                contactEmail.textContent = settings.contactEmail;
            }
            const contactAddress = document.getElementById('contact-address');
            if (contactAddress && settings.contactAddress) {
                contactAddress.textContent = settings.contactAddress;
            }

            // Social links
            const fbLink = document.getElementById('social-facebook');
            if (fbLink && settings.facebookUrl) {
                fbLink.href = settings.facebookUrl;
                fbLink.target = '_blank';
            }
            const igLink = document.getElementById('social-instagram');
            if (igLink && settings.instagramUrl) {
                igLink.href = settings.instagramUrl;
                igLink.target = '_blank';
            }
            const ytLink = document.getElementById('social-youtube');
            if (ytLink && settings.youtubeUrl) {
                ytLink.href = settings.youtubeUrl;
                ytLink.target = '_blank';
            }

            // Footer motto
            const footerMotto = document.getElementById('footer-motto');
            if (footerMotto && settings.motto) {
                footerMotto.textContent = `"${settings.motto}"`;
            }

            // Footer copyright site name
            const footerSiteName = document.getElementById('footer-site-name');
            if (footerSiteName && settings.siteName) {
                footerSiteName.textContent = settings.siteName;
            }

            // Page title
            if (settings.siteName) {
                document.title = settings.siteName + ' | Contes Africains';
            }

        } catch (err) {
            console.log('Settings API not available, using defaults');
        }
    }

    async function loadDynamicContent() {
        try {
            const [books, interviews, blogPosts, gallery] = await Promise.all([
                fetch('/api/books').then(r => r.json()).catch(() => []),
                fetch('/api/interviews').then(r => r.json()).catch(() => []),
                fetch('/api/blog').then(r => r.json()).catch(() => []),
                fetch('/api/gallery').then(r => r.json()).catch(() => []),
            ]);

            // Render books
            const featuredBook = books.find(b => b.featured);
            const regularBooks = books.filter(b => !b.featured);
            const featuredContainer = document.getElementById('book-featured-container');
            const booksGrid = document.getElementById('books-grid');

            if (featuredBook && featuredContainer) {
                featuredContainer.innerHTML = `
                    <div class="book-featured" data-aos="fade-up">
                        ${featuredBook.badge ? `<div class="book-featured__badge">${featuredBook.badge}</div>` : ''}
                        <div class="book-featured__content">
                            <div class="book-featured__image">
                                ${featuredBook.coverImage
                                    ? `<img src="${featuredBook.coverImage}" alt="${featuredBook.title}" class="book-featured__cover">`
                                    : `<div class="book__cover book__cover--placeholder"><span>${featuredBook.title}</span></div>`}
                            </div>
                            <div class="book-featured__info">
                                <span class="book-featured__author">${featuredBook.author}</span>
                                <h3 class="book-featured__title">${featuredBook.title}</h3>
                                ${featuredBook.subtitle ? `<p class="book-featured__subtitle">${featuredBook.subtitle}</p>` : ''}
                                <p class="book-featured__description">${featuredBook.description.replace(/\n/g, '<br>')}</p>
                                ${featuredBook.publisher ? `<div class="book-featured__meta"><span class="book-featured__publisher">${featuredBook.publisher}</span></div>` : ''}
                                <div class="book-featured__buttons">
                                    ${featuredBook.amazonUrl ? `<a href="${featuredBook.amazonUrl}" target="_blank" class="btn btn--primary"><span>Acheter sur Amazon</span></a>` : ''}
                                    <a href="#contact" class="btn btn--outline"><span>Commander sur le site</span></a>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            if (booksGrid) {
                booksGrid.innerHTML = regularBooks.map((b, i) => `
                    <article class="book-card" data-aos="fade-up" data-aos-delay="${i * 100}">
                        <div class="book-card__image">
                            ${b.coverImage
                                ? `<img src="${b.coverImage}" alt="${b.title}" class="book-card__cover">`
                                : `<div class="book-card__cover" style="aspect-ratio:3/4;background:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark));display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-heading);padding:1rem;text-align:center;">${b.title}</div>`}
                            <div class="book-card__overlay">
                                ${b.amazonUrl ? `<a href="${b.amazonUrl}" target="_blank" class="btn btn--small">Acheter</a>` : `<a href="#contact" class="btn btn--small">Commander</a>`}
                            </div>
                        </div>
                        <div class="book-card__content">
                            <h3 class="book-card__title">${b.title}</h3>
                            <p class="book-card__description">${b.description}</p>
                            <div class="book-card__footer">
                                ${b.price ? `<span class="book-card__price">${b.price}</span>` : '<span></span>'}
                                ${b.amazonUrl ? `<a href="${b.amazonUrl}" target="_blank" class="book-card__link">Acheter →</a>` : `<a href="#contact" class="book-card__link">Commander →</a>`}
                            </div>
                        </div>
                    </article>`).join('');
            }

            // Render interviews
            const interviewsGrid = document.getElementById('interviews-grid');
            if (interviewsGrid && interviews.length > 0) {
                interviewsGrid.innerHTML = interviews.map((iv, i) => `
                    <article class="interview-card" data-aos="fade-up" data-aos-delay="${i * 100}">
                        <div class="interview-card__video">
                            <iframe src="${getYouTubeEmbedUrl(iv.youtubeUrl)}" title="${iv.title}"
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen class="video__iframe"></iframe>
                            ${iv.badge ? `<div class="video__badge">${iv.badge}</div>` : ''}
                        </div>
                        <div class="interview-card__content">
                            ${iv.date ? `<span class="interview-card__date">${iv.date}</span>` : ''}
                            <h3 class="interview-card__title">${iv.title}</h3>
                        </div>
                    </article>`).join('');
            }

            // Render blog
            const blogGrid = document.getElementById('blog-grid');
            if (blogGrid && blogPosts.length > 0) {
                blogGrid.innerHTML = blogPosts.map((p, i) => `
                    <article class="blog-card ${i === 0 ? 'blog-card--featured' : ''}" data-aos="fade-up" data-aos-delay="${i * 100}">
                        ${i === 0 && p.image ? `<div class="blog-card__image"><img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` :
                          i === 0 ? `<div class="blog-card__image"><div class="blog__placeholder"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg></div></div>` : ''}
                        <div class="blog-card__content">
                            <div class="blog-card__meta">
                                <span class="blog-card__category">${p.category}</span>
                                <span class="blog-card__date">${new Date(p.createdAt).toLocaleDateString('fr-CA', {day:'numeric',month:'long',year:'numeric'})}</span>
                            </div>
                            <h3 class="blog-card__title">${p.title}</h3>
                            <p class="blog-card__excerpt">${p.excerpt}</p>
                            <a href="/blog/${p.slug}" class="blog-card__link">Lire la suite →</a>
                        </div>
                    </article>`).join('');
            }

            // Render gallery
            const galleryGrid = document.getElementById('gallery-grid');
            if (galleryGrid && gallery.length > 0) {
                galleryGrid.innerHTML = gallery.map((g, i) => `
                    <div class="gallery__item ${g.wide ? 'gallery__item--wide' : ''} ${g.tall ? 'gallery__item--tall' : ''}" data-aos="fade-up" data-aos-delay="${i * 50}">
                        <img src="${g.imageUrl}" alt="${g.title || g.caption || ''}" style="width:100%;height:100%;object-fit:cover;">
                    </div>`).join('');
            } else if (galleryGrid) {
                // Show placeholders if no images yet
                galleryGrid.innerHTML = Array.from({length: 6}, (_, i) => `
                    <div class="gallery__item ${i === 0 ? 'gallery__item--wide' : ''} ${i === 4 ? 'gallery__item--tall' : ''}" data-aos="fade-up" data-aos-delay="${i * 50}">
                        <div class="gallery__placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                    </div>`).join('');
            }

            // Re-init animations for dynamically loaded content
            initAnimations();

        } catch (err) {
            console.log('API not available, showing static content');
        }
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
        initVideoPlayers();
        loadSettings();
        loadDynamicContent();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
