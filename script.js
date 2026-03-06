(() => {
    const themeToggle = document.getElementById('theme-toggle');
    const THEME_KEY = 'portfolio-theme';

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-theme', isLight);

        if (themeToggle) {
            themeToggle.textContent = isLight ? 'Хар горим' : 'Цагаан горим';
            themeToggle.setAttribute('aria-pressed', String(isLight));
        }
    };

    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

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

    if (!navLinks.length || !sections.length) {
        return;
    }

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

            if (!target) {
                return;
            }

            event.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
            window.scrollTo({ top, behavior: 'smooth' });
            history.replaceState(null, '', `#${targetId}`);
        });
    });

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        {
            root: null,
            rootMargin: '-40% 0px -45% 0px',
            threshold: 0.1,
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = 'opacity 550ms ease, transform 550ms ease';
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: '0px 0px -10% 0px',
        }
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
                showStatus('Бүх талбарыг бөглөнө үү.', true);
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Илгээж байна...';
            }

            setTimeout(() => {
                form.reset();
                showStatus('Баярлалаа. Таны мессеж амжилттай илгээгдлээ.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Мессеж илгээх';
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
    } else {
        setActiveLink(sections[0].id);
    }
})();

const PASSWORD = '1234';
const loginBTN = document.getElementById('login-button');
const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginError = document.getElementById('login-error');

if (loginBTN && loginSection && adminPanel && loginError) {
    loginBTN.addEventListener('click', () => {
        const password = document.getElementById('admin-password')?.value || '';
        if (password === PASSWORD) {
            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            console.log('Амжилттай нэвтэрлээ.');
        } else {
            loginError.textContent = 'Нууц үг буруу байна.';
            console.log('Нэвтрэх оролдлого амжилтгүй боллоо.');
        }
    });
}
