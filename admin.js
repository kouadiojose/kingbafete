/**
 * King Bafété - Admin Panel JavaScript
 * localStorage-based content management system
 */

(function () {
    'use strict';

    // =========================================
    // Default Data
    // =========================================
    const DEFAULT_CREDENTIALS = { username: 'admin', password: 'kingbafete2026' };

    const DEFAULT_GALLERY = [
        { id: 1, caption: 'Soirée de lancement - Devoir de Mémoire', category: 'evenements', date: 'Mars 2025', color1: '#D4722C', color2: '#D4AF37', size: 'wide' },
        { id: 2, caption: 'Séance de dédicaces', category: 'livres', date: 'Décembre 2024', color1: '#2C3E50', color2: '#1A252F', size: 'normal' },
        { id: 3, caption: 'Gala SOFIFRAN 2024', category: 'communaute', date: 'Novembre 2024', color1: '#C0392B', color2: '#922B21', size: 'normal' },
        { id: 4, caption: 'Interview TV - Capital TV', category: 'medias', date: 'Octobre 2024', color1: '#8E44AD', color2: '#6C3483', size: 'normal' },
        { id: 5, caption: 'Réception Ordre de la Pléiade', category: 'evenements', date: '2019', color1: '#D4AF37', color2: '#8B6914', size: 'tall' },
        { id: 6, caption: 'Atelier contes pour enfants', category: 'communaute', date: 'Septembre 2024', color1: '#27AE60', color2: '#1E8449', size: 'normal' },
        { id: 7, caption: 'Salon du livre francophone', category: 'livres', date: 'Juin 2024', color1: '#E67E22', color2: '#D35400', size: 'normal' },
        { id: 8, caption: 'Entrevue Radio-Canada', category: 'medias', date: 'Mai 2024', color1: '#2980B9', color2: '#1B4F72', size: 'wide' },
        { id: 9, caption: 'Festival culturel africain', category: 'evenements', date: 'Août 2023', color1: '#1ABC9C', color2: '#0E6655', size: 'normal' }
    ];

    const DEFAULT_BOOKS = [
        { id: 1, title: 'Dias, Thérapeute et Homme léopard', description: 'Grand-père Dias était un homme ordinaire, humble et sans histoire seulement en apparence.', price: '12.00', link: '#' },
        { id: 2, title: 'Nyota, le secret de la plume', description: 'Une histoire captivante qui révèle les secrets ancestraux transmis de génération en génération.', price: '25.00', link: '#' },
        { id: 3, title: 'Le Soleil, la Lune et les Étoiles', description: 'Les contes de maman Fété : Le Soleil, la Lune et les Étoiles, le Coq, la Poule et les Poussins.', price: '15.00', link: '#' },
        { id: 4, title: 'Mois d\'Espoir - Mélanges pour l\'Afrique', description: 'Une compilation unique célébrant la richesse culturelle et l\'espoir du continent africain.', price: '15.00', link: '#' }
    ];

    const DEFAULT_BLOG = [
        { id: 1, title: 'L\'importance de préserver nos traditions orales', category: 'Culture', excerpt: 'La transmission orale est le pilier de notre culture africaine. Découvrez pourquoi il est crucial de documenter ces trésors...', date: '2025-12-15' },
        { id: 2, title: 'Rencontre littéraire à Toronto', category: 'Événement', excerpt: 'Rejoignez-nous pour une soirée de contes et de partage...', date: '2025-12-10' },
        { id: 3, title: 'Mon parcours d\'écrivaine', category: 'Littérature', excerpt: 'De Kinshasa à Welland, comment l\'écriture m\'a permis de rester connectée...', date: '2025-12-05' }
    ];

    const DEFAULT_ABOUT = {
        highlight: 'Madame Fété Ngira-Batware Kimpiobi a immigré au Canada en octobre 1999, en provenance de la R D Congo, son pays d\'origine.',
        text1: 'Après un séjour de cinq ans et demi à Montréal, elle s\'est installée à Welland, en Ontario. Dans son Congo natal, elle s\'était imposée parmi les personnalités culturelles reconnues de Kinshasa, la capitale.',
        text2: 'De nature hyperactive, elle a toujours mené de front plusieurs activités : directrice d\'une multinationale de négoce internationale, exploitante d\'une galerie d\'art, mécène et éditrice de trois magazines.',
        text3: 'En 2007, elle a co-fondé l\'organisme SOFIFRAN (Solidarité des Femmes et Familles Interconnectées Francophones du Niagara) avec un groupe de femmes immigrantes francophones.',
        stats: [
            { value: 25, label: 'Années d\'expérience' },
            { value: 4, label: 'Livres publiés' },
            { value: 1000, label: 'Lecteurs touchés' }
        ]
    };

    // =========================================
    // Storage Helpers
    // =========================================
    function getData(key, defaultValue) {
        const stored = localStorage.getItem('kb_' + key);
        return stored ? JSON.parse(stored) : defaultValue;
    }

    function setData(key, value) {
        localStorage.setItem('kb_' + key, JSON.stringify(value));
    }

    function getNextId(items) {
        if (!items.length) return 1;
        return Math.max(...items.map(i => i.id)) + 1;
    }

    // =========================================
    // Toast Notifications
    // =========================================
    function showToast(message, type) {
        type = type || 'success';
        var container = document.getElementById('toast-container');
        var toast = document.createElement('div');
        toast.className = 'toast toast--' + type;
        toast.innerHTML = '<span class="toast__message">' + escapeHtml(message) + '</span><button class="toast__close">&times;</button>';

        container.appendChild(toast);

        toast.querySelector('.toast__close').addEventListener('click', function () {
            toast.remove();
        });

        setTimeout(function () {
            if (toast.parentNode) toast.remove();
        }, 4000);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================
    // Authentication
    // =========================================
    function initAuth() {
        var loginForm = document.getElementById('login-form');
        var loginScreen = document.getElementById('login-screen');
        var dashboard = document.getElementById('admin-dashboard');
        var logoutBtn = document.getElementById('logout-btn');

        // Check if already logged in
        if (sessionStorage.getItem('kb_auth') === 'true') {
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            initDashboard();
            return;
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var username = document.getElementById('login-user').value;
            var password = document.getElementById('login-pass').value;
            var errorEl = document.getElementById('login-error');
            var creds = getData('credentials', DEFAULT_CREDENTIALS);

            if (username === creds.username && password === creds.password) {
                sessionStorage.setItem('kb_auth', 'true');
                loginScreen.style.display = 'none';
                dashboard.style.display = 'flex';
                initDashboard();
            } else {
                errorEl.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
            }
        });

        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('kb_auth');
            location.reload();
        });
    }

    // =========================================
    // Sidebar Navigation
    // =========================================
    function initSidebar() {
        var links = document.querySelectorAll('.sidebar__link[data-section]');
        var panels = document.querySelectorAll('.panel');
        var pageTitle = document.getElementById('page-title');
        var toggleBtn = document.getElementById('sidebar-toggle');
        var sidebar = document.getElementById('sidebar');

        var titles = {
            dashboard: 'Tableau de bord',
            gallery: 'Gestion de la Galerie',
            books: 'Gestion des Livres',
            blog: 'Gestion du Blog',
            about: 'Section À Propos',
            settings: 'Paramètres'
        };

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var section = this.dataset.section;

                links.forEach(function (l) { l.classList.remove('active'); });
                this.classList.add('active');

                panels.forEach(function (p) { p.classList.remove('active'); });
                var targetPanel = document.getElementById('panel-' + section);
                if (targetPanel) targetPanel.classList.add('active');

                if (pageTitle) pageTitle.textContent = titles[section] || section;

                // Close mobile sidebar
                if (sidebar) sidebar.classList.remove('open');
            });
        });

        // Quick action buttons
        document.querySelectorAll('[data-goto]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var section = this.dataset.goto;
                var link = document.querySelector('.sidebar__link[data-section="' + section + '"]');
                if (link) link.click();
            });
        });

        // Mobile toggle
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.toggle('open');
            });
        }
    }

    // =========================================
    // Gallery Management
    // =========================================
    function initGalleryAdmin() {
        var gallery = getData('gallery', DEFAULT_GALLERY);
        var modal = document.getElementById('gallery-modal');
        var form = document.getElementById('gallery-form');
        var addBtn = document.getElementById('add-gallery-btn');

        function renderGallery() {
            gallery = getData('gallery', DEFAULT_GALLERY);
            var list = document.getElementById('admin-gallery-list');
            if (!list) return;

            list.innerHTML = gallery.map(function (item) {
                var categoryLabels = { evenements: 'Événements', livres: 'Livres', communaute: 'Communauté', medias: 'Médias' };
                return '<div class="admin-gallery-card">' +
                    '<div class="admin-gallery-card__image" style="background: linear-gradient(135deg, ' + escapeHtml(item.color1) + ' 0%, ' + escapeHtml(item.color2) + ' 100%);">' +
                    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>' +
                    '</div>' +
                    '<div class="admin-gallery-card__info">' +
                    '<div class="admin-gallery-card__title">' + escapeHtml(item.caption) + '</div>' +
                    '<div class="admin-gallery-card__meta">' +
                    '<span class="admin-gallery-card__category">' + escapeHtml(categoryLabels[item.category] || item.category) + '</span>' +
                    '<span>' + escapeHtml(item.date) + '</span>' +
                    '</div>' +
                    '<div class="admin-gallery-card__actions">' +
                    '<button class="btn-admin btn-admin--edit" data-edit="' + item.id + '">Modifier</button>' +
                    '<button class="btn-admin btn-admin--danger" data-delete="' + item.id + '">Supprimer</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');

            // Edit/Delete handlers
            list.querySelectorAll('[data-edit]').forEach(function (btn) {
                btn.addEventListener('click', function () { editGalleryItem(parseInt(this.dataset.edit)); });
            });
            list.querySelectorAll('[data-delete]').forEach(function (btn) {
                btn.addEventListener('click', function () { deleteGalleryItem(parseInt(this.dataset.delete)); });
            });

            updateStats();
        }

        function openModal(item) {
            document.getElementById('gallery-modal-title').textContent = item ? 'Modifier la photo' : 'Ajouter une photo';
            document.getElementById('gallery-edit-id').value = item ? item.id : '';
            document.getElementById('gallery-caption').value = item ? item.caption : '';
            document.getElementById('gallery-category').value = item ? item.category : 'evenements';
            document.getElementById('gallery-date').value = item ? item.date : '';
            document.getElementById('gallery-color1').value = item ? item.color1 : '#D4722C';
            document.getElementById('gallery-color2').value = item ? item.color2 : '#D4AF37';
            document.getElementById('gallery-size').value = item ? item.size : 'normal';
            modal.classList.add('active');
        }

        function editGalleryItem(id) {
            var item = gallery.find(function (g) { return g.id === id; });
            if (item) openModal(item);
        }

        function deleteGalleryItem(id) {
            if (!confirm('Supprimer cette photo de la galerie ?')) return;
            gallery = gallery.filter(function (g) { return g.id !== id; });
            setData('gallery', gallery);
            renderGallery();
            showToast('Photo supprimée avec succès');
        }

        addBtn.addEventListener('click', function () { openModal(null); });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = document.getElementById('gallery-edit-id').value;
            var itemData = {
                caption: document.getElementById('gallery-caption').value,
                category: document.getElementById('gallery-category').value,
                date: document.getElementById('gallery-date').value,
                color1: document.getElementById('gallery-color1').value,
                color2: document.getElementById('gallery-color2').value,
                size: document.getElementById('gallery-size').value
            };

            if (editId) {
                var idx = gallery.findIndex(function (g) { return g.id === parseInt(editId); });
                if (idx !== -1) {
                    gallery[idx] = Object.assign({}, gallery[idx], itemData);
                }
            } else {
                itemData.id = getNextId(gallery);
                gallery.push(itemData);
            }

            setData('gallery', gallery);
            modal.classList.remove('active');
            renderGallery();
            showToast(editId ? 'Photo modifiée avec succès' : 'Photo ajoutée avec succès');
        });

        // Modal close handlers
        setupModalClose(modal);
        renderGallery();
    }

    // =========================================
    // Books Management
    // =========================================
    function initBooksAdmin() {
        var books = getData('books', DEFAULT_BOOKS);
        var modal = document.getElementById('book-modal');
        var form = document.getElementById('book-form');
        var addBtn = document.getElementById('add-book-btn');

        function renderBooks() {
            books = getData('books', DEFAULT_BOOKS);
            var list = document.getElementById('admin-books-list');
            if (!list) return;

            list.innerHTML = books.map(function (book) {
                return '<tr>' +
                    '<td><strong>' + escapeHtml(book.title) + '</strong></td>' +
                    '<td>' + escapeHtml(book.description.substring(0, 60)) + '...</td>' +
                    '<td>$' + escapeHtml(book.price) + '</td>' +
                    '<td class="actions-cell">' +
                    '<button class="btn-admin btn-admin--edit" data-edit="' + book.id + '">Modifier</button>' +
                    '<button class="btn-admin btn-admin--danger" data-delete="' + book.id + '">Supprimer</button>' +
                    '</td></tr>';
            }).join('');

            list.querySelectorAll('[data-edit]').forEach(function (btn) {
                btn.addEventListener('click', function () { editBook(parseInt(this.dataset.edit)); });
            });
            list.querySelectorAll('[data-delete]').forEach(function (btn) {
                btn.addEventListener('click', function () { deleteBook(parseInt(this.dataset.delete)); });
            });

            updateStats();
        }

        function openModal(book) {
            document.getElementById('book-modal-title').textContent = book ? 'Modifier le livre' : 'Ajouter un livre';
            document.getElementById('book-edit-id').value = book ? book.id : '';
            document.getElementById('book-title').value = book ? book.title : '';
            document.getElementById('book-description').value = book ? book.description : '';
            document.getElementById('book-price').value = book ? book.price : '';
            document.getElementById('book-link').value = book ? book.link : '';
            modal.classList.add('active');
        }

        function editBook(id) {
            var book = books.find(function (b) { return b.id === id; });
            if (book) openModal(book);
        }

        function deleteBook(id) {
            if (!confirm('Supprimer ce livre ?')) return;
            books = books.filter(function (b) { return b.id !== id; });
            setData('books', books);
            renderBooks();
            showToast('Livre supprimé avec succès');
        }

        addBtn.addEventListener('click', function () { openModal(null); });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = document.getElementById('book-edit-id').value;
            var bookData = {
                title: document.getElementById('book-title').value,
                description: document.getElementById('book-description').value,
                price: document.getElementById('book-price').value,
                link: document.getElementById('book-link').value || '#'
            };

            if (editId) {
                var idx = books.findIndex(function (b) { return b.id === parseInt(editId); });
                if (idx !== -1) {
                    books[idx] = Object.assign({}, books[idx], bookData);
                }
            } else {
                bookData.id = getNextId(books);
                books.push(bookData);
            }

            setData('books', books);
            modal.classList.remove('active');
            renderBooks();
            showToast(editId ? 'Livre modifié avec succès' : 'Livre ajouté avec succès');
        });

        setupModalClose(modal);
        renderBooks();
    }

    // =========================================
    // Blog Management
    // =========================================
    function initBlogAdmin() {
        var blog = getData('blog', DEFAULT_BLOG);
        var modal = document.getElementById('blog-modal');
        var form = document.getElementById('blog-form');
        var addBtn = document.getElementById('add-blog-btn');

        function renderBlog() {
            blog = getData('blog', DEFAULT_BLOG);
            var list = document.getElementById('admin-blog-list');
            if (!list) return;

            list.innerHTML = blog.map(function (article) {
                var dateStr = article.date;
                try {
                    var d = new Date(article.date);
                    if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                    }
                } catch (e) { /* keep original */ }

                return '<tr>' +
                    '<td><strong>' + escapeHtml(article.title) + '</strong></td>' +
                    '<td>' + escapeHtml(article.category) + '</td>' +
                    '<td>' + escapeHtml(dateStr) + '</td>' +
                    '<td class="actions-cell">' +
                    '<button class="btn-admin btn-admin--edit" data-edit="' + article.id + '">Modifier</button>' +
                    '<button class="btn-admin btn-admin--danger" data-delete="' + article.id + '">Supprimer</button>' +
                    '</td></tr>';
            }).join('');

            list.querySelectorAll('[data-edit]').forEach(function (btn) {
                btn.addEventListener('click', function () { editArticle(parseInt(this.dataset.edit)); });
            });
            list.querySelectorAll('[data-delete]').forEach(function (btn) {
                btn.addEventListener('click', function () { deleteArticle(parseInt(this.dataset.delete)); });
            });

            updateStats();
        }

        function openModal(article) {
            document.getElementById('blog-modal-title').textContent = article ? 'Modifier l\'article' : 'Nouvel article';
            document.getElementById('blog-edit-id').value = article ? article.id : '';
            document.getElementById('blog-title').value = article ? article.title : '';
            document.getElementById('blog-category').value = article ? article.category : 'Culture';
            document.getElementById('blog-excerpt').value = article ? article.excerpt : '';
            document.getElementById('blog-date').value = article ? article.date : new Date().toISOString().split('T')[0];
            modal.classList.add('active');
        }

        function editArticle(id) {
            var article = blog.find(function (a) { return a.id === id; });
            if (article) openModal(article);
        }

        function deleteArticle(id) {
            if (!confirm('Supprimer cet article ?')) return;
            blog = blog.filter(function (a) { return a.id !== id; });
            setData('blog', blog);
            renderBlog();
            showToast('Article supprimé avec succès');
        }

        addBtn.addEventListener('click', function () { openModal(null); });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = document.getElementById('blog-edit-id').value;
            var articleData = {
                title: document.getElementById('blog-title').value,
                category: document.getElementById('blog-category').value,
                excerpt: document.getElementById('blog-excerpt').value,
                date: document.getElementById('blog-date').value
            };

            if (editId) {
                var idx = blog.findIndex(function (a) { return a.id === parseInt(editId); });
                if (idx !== -1) {
                    blog[idx] = Object.assign({}, blog[idx], articleData);
                }
            } else {
                articleData.id = getNextId(blog);
                blog.push(articleData);
            }

            setData('blog', blog);
            modal.classList.remove('active');
            renderBlog();
            showToast(editId ? 'Article modifié avec succès' : 'Article publié avec succès');
        });

        setupModalClose(modal);
        renderBlog();
    }

    // =========================================
    // About Management
    // =========================================
    function initAboutAdmin() {
        var about = getData('about', DEFAULT_ABOUT);
        var saveBtn = document.getElementById('save-about-btn');

        // Populate form
        document.getElementById('about-highlight').value = about.highlight || '';
        document.getElementById('about-text1').value = about.text1 || '';
        document.getElementById('about-text2').value = about.text2 || '';
        document.getElementById('about-text3').value = about.text3 || '';

        if (about.stats && about.stats.length >= 3) {
            document.getElementById('about-stat1-value').value = about.stats[0].value;
            document.getElementById('about-stat1-label').value = about.stats[0].label;
            document.getElementById('about-stat2-value').value = about.stats[1].value;
            document.getElementById('about-stat2-label').value = about.stats[1].label;
            document.getElementById('about-stat3-value').value = about.stats[2].value;
            document.getElementById('about-stat3-label').value = about.stats[2].label;
        }

        saveBtn.addEventListener('click', function () {
            var data = {
                highlight: document.getElementById('about-highlight').value,
                text1: document.getElementById('about-text1').value,
                text2: document.getElementById('about-text2').value,
                text3: document.getElementById('about-text3').value,
                stats: [
                    { value: parseInt(document.getElementById('about-stat1-value').value) || 0, label: document.getElementById('about-stat1-label').value },
                    { value: parseInt(document.getElementById('about-stat2-value').value) || 0, label: document.getElementById('about-stat2-label').value },
                    { value: parseInt(document.getElementById('about-stat3-value').value) || 0, label: document.getElementById('about-stat3-label').value }
                ]
            };
            setData('about', data);
            showToast('Section À Propos mise à jour');
        });
    }

    // =========================================
    // Settings Management
    // =========================================
    function initSettingsAdmin() {
        var saveBtn = document.getElementById('save-settings-btn');
        var settings = getData('settings', { title: 'King Bafété', tagline: 'Là où tu es semé, il te fleurira', email: '', phone: '' });

        document.getElementById('setting-title').value = settings.title || '';
        document.getElementById('setting-tagline').value = settings.tagline || '';
        document.getElementById('setting-email').value = settings.email || '';
        document.getElementById('setting-phone').value = settings.phone || '';

        var creds = getData('credentials', DEFAULT_CREDENTIALS);
        document.getElementById('setting-username').value = creds.username;

        saveBtn.addEventListener('click', function () {
            // Save site settings
            var siteData = {
                title: document.getElementById('setting-title').value,
                tagline: document.getElementById('setting-tagline').value,
                email: document.getElementById('setting-email').value,
                phone: document.getElementById('setting-phone').value
            };
            setData('settings', siteData);

            // Save credentials if changed
            var newUsername = document.getElementById('setting-username').value;
            var newPassword = document.getElementById('setting-password').value;
            var confirmPassword = document.getElementById('setting-password-confirm').value;

            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    showToast('Les mots de passe ne correspondent pas', 'error');
                    return;
                }
                setData('credentials', { username: newUsername, password: newPassword });
                showToast('Paramètres et identifiants mis à jour');
            } else {
                var currentCreds = getData('credentials', DEFAULT_CREDENTIALS);
                setData('credentials', { username: newUsername, password: currentCreds.password });
                showToast('Paramètres enregistrés avec succès');
            }

            document.getElementById('setting-password').value = '';
            document.getElementById('setting-password-confirm').value = '';
        });
    }

    // =========================================
    // Update Dashboard Stats
    // =========================================
    function updateStats() {
        var gallery = getData('gallery', DEFAULT_GALLERY);
        var books = getData('books', DEFAULT_BOOKS);
        var blog = getData('blog', DEFAULT_BLOG);

        var statGallery = document.getElementById('stat-gallery');
        var statBooks = document.getElementById('stat-books');
        var statBlog = document.getElementById('stat-blog');

        if (statGallery) statGallery.textContent = gallery.length;
        if (statBooks) statBooks.textContent = books.length;
        if (statBlog) statBlog.textContent = blog.length;
    }

    // =========================================
    // Modal Close Helper
    // =========================================
    function setupModalClose(modal) {
        var backdrop = modal.querySelector('.modal__backdrop');
        var closeBtn = modal.querySelector('.modal__close');
        var cancelBtn = modal.querySelector('.modal__cancel');

        function close() { modal.classList.remove('active'); }

        if (backdrop) backdrop.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (cancelBtn) cancelBtn.addEventListener('click', close);
    }

    // =========================================
    // Initialize Dashboard
    // =========================================
    function initDashboard() {
        initSidebar();
        initGalleryAdmin();
        initBooksAdmin();
        initBlogAdmin();
        initAboutAdmin();
        initSettingsAdmin();
        updateStats();
    }

    // =========================================
    // Initialize
    // =========================================
    function init() {
        initAuth();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
