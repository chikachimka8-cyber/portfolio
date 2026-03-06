(() => {
    const themeToggle = document.getElementById('theme-toggle');
    const THEME_KEY = 'portfolio-theme';

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-theme', isLight);
        if (themeToggle) {
            themeToggle.textContent = isLight ? 'Har gorim' : 'Tsagaan gorim';
            themeToggle.setAttribute('aria-pressed', String(isLight));
        }
    };

    applyTheme(localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(nextTheme);
            localStorage.setItem(THEME_KEY, nextTheme);
        });
    }

    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const cards = Array.from(document.querySelectorAll('.card, .project-card, .contact-wrap'));
    const form = document.querySelector('.contact-form');
    const header = document.querySelector('.topbar');

    const headerOffset = () => (header ? header.offsetHeight + 12 : 86);

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.borderColor = isActive ? 'var(--active-line)' : 'transparent';
            link.style.background = isActive ? 'var(--active-bg)' : 'transparent';
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href')?.replace('#', '');
            const target = targetId ? document.getElementById(targetId) : null;
            if (!target) return;

            event.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
            window.scrollTo({ top, behavior: 'smooth' });
            history.replaceState(null, '', `#${targetId}`);
        });
    });

    if (sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveLink(entry.target.id);
                });
            },
            { root: null, rootMargin: '-40% 0px -45% 0px', threshold: 0.1 }
        );
        sections.forEach((section) => sectionObserver.observe(section));
    }

    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = 'opacity 550ms ease, transform 550ms ease';
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
        revealObserver.observe(card);
    });

    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = Array.from(form.querySelectorAll('input, textarea'));

        const showStatus = (message, isError = false) => {
            let status = form.querySelector('.form-status');
            if (!status) {
                status = document.createElement('p');
                status.className = 'form-status';
                status.style.marginTop = '0.3rem';
                status.style.fontWeight = '700';
                status.style.fontSize = '0.92rem';
                form.appendChild(status);
            }
            status.textContent = message;
            status.style.color = isError ? '#ff8f8f' : '#7ef6d1';
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const isInvalid = inputs.some((input) => !String(input.value || '').trim());
            if (isInvalid) {
                showStatus('Bugdiig ni buglunu uu.', true);
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Ilgeej baina...';
            }

            setTimeout(() => {
                form.reset();
                showStatus('Bayarlalaa. Amjilttai ilgeegdlee.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Message ilgeeh';
                }
            }, 850);
        });
    }

    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const initialSection = sections.find((section) => section.id === hash);
        if (initialSection) {
            setTimeout(() => {
                const top = initialSection.getBoundingClientRect().top + window.scrollY - headerOffset();
                window.scrollTo({ top, behavior: 'smooth' });
            }, 0);
            setActiveLink(hash);
        }
    } else if (sections.length) {
        setActiveLink(sections[0].id);
    }
})();

(() => {
    const PASSWORD = '1234';
    const CONTENT_KEY = 'portfolio-content-v1';

    const loginBtn = document.getElementById('login-button');
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginError = document.getElementById('login-error');
    const editBtn = document.getElementById('enable-edit-name');
    const saveBtn = document.getElementById('enable-edit-description');

    if (!loginBtn || !loginSection || !adminPanel || !loginError || !editBtn || !saveBtn) return;

    adminPanel.style.display = 'none';
    saveBtn.disabled = true;

    const editableSelector = [
        '.brand',
        '#hero .eyebrow',
        '#hero h1',
        '#hero .lead',
        '#hero .stats li',
        '#about h2',
        '#about .about-copy p',
        '#skills h2',
        '#skills .card h3',
        '#skills .card p',
        '#projects h2',
        '#projects .project-body h3',
        '#projects .project-body p',
        '#contact h2',
        '#contact .contact-subtitle',
        '.footer-wrap p'
    ].join(', ');

    const editableNodes = Array.from(document.querySelectorAll(editableSelector));
    editableNodes.forEach((node, index) => {
        node.dataset.editKey = `editable-${index}`;
    });

    const setEditMode = (enabled) => {
        editableNodes.forEach((node) => {
            node.contentEditable = enabled ? 'true' : 'false';
            node.spellcheck = false;
            node.style.outline = enabled ? '2px dashed var(--accent-2)' : '';
            node.style.outlineOffset = enabled ? '3px' : '';
            node.style.borderRadius = enabled ? '6px' : '';
            node.style.cursor = enabled ? 'text' : '';
        });
        editBtn.textContent = enabled ? 'Zasvar hiij baina...' : 'Zasah gorim';
        saveBtn.disabled = !enabled;
    };

    const loadContent = () => {
        const raw = localStorage.getItem(CONTENT_KEY);
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            editableNodes.forEach((node) => {
                const key = node.dataset.editKey;
                if (key && typeof data[key] === 'string') node.innerHTML = data[key];
            });
        } catch (_) {}
    };

    const saveContent = () => {
        const data = {};
        editableNodes.forEach((node) => {
            const key = node.dataset.editKey;
            if (key) data[key] = node.innerHTML;
        });
        localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
    };

    loadContent();

    loginBtn.addEventListener('click', () => {
        const password = document.getElementById('admin-password')?.value || '';
        if (password === PASSWORD) {
            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Nuuts ug buruu baina.';
        }
    });

    editBtn.addEventListener('click', () => {
        setEditMode(true);
    });

    saveBtn.addEventListener('click', () => {
        saveContent();
        setEditMode(false);
    });
})();
