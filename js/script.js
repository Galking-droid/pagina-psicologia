const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.55 });

sections.forEach(section => observer.observe(section));

// Header vidrio al hacer scroll
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// Reveal + stagger
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Activa stagger en hijos si existe
            if (entry.target.classList.contains('stagger') || entry.target.querySelector('.stagger')) {
                entry.target.classList.add('visible');
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

revealElements.forEach(el => revealObserver.observe(el));

// Parallax sutil en hero (respeta reduced-motion)
const parallaxEl = document.querySelector('[data-parallax]');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (parallaxEl && !prefersReduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const offset = Math.min(window.scrollY * 0.08, 36);
            parallaxEl.style.transform = `translateY(${offset}px)`;
            ticking = false;
        });
    }, { passive: true });
}

// Hamburger + backdrop
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');
const menuBackdrop = document.getElementById('menuBackdrop');

const toggleMenu = (forceOpen) => {
    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    hamburgerMenu.setAttribute('aria-expanded', String(isOpen));
    hamburgerMenu.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    const icon = hamburgerMenu.querySelector('i');
    icon.classList.toggle('fa-times', isOpen);
    icon.classList.toggle('fa-bars', !isOpen);
    if (menuBackdrop) menuBackdrop.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return isOpen;
};

if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
        if (toggleMenu()) navMenu.querySelector('a')?.focus();
    });
    navLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    if (menuBackdrop) menuBackdrop.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('click', (event) => {
        const inside = navMenu.contains(event.target) || hamburgerMenu.contains(event.target);
        if (!inside && navMenu.classList.contains('open')) toggleMenu(false);
    });
    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('open')) toggleMenu(false);
    }, { passive: true });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu(false);
            hamburgerMenu.focus();
        }
    });
}

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 360);
}, { passive: true });

// Carrusel testimonios
const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');

if (track && dotsWrap) {
    const cards = track.querySelectorAll('.testimonial-card');
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');
    const updateDots = () => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0; let minDist = Infinity;
        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(center - cardCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === closest);
            if (i === closest) d.setAttribute('aria-current', 'true');
            else d.removeAttribute('aria-current');
        });
    };
    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateDots);
    }, { passive: true });
    const scrollByCard = (dir) => {
        const gap = 20;
        const w = cards[0].offsetWidth + gap;
        track.scrollBy({ left: dir * w, behavior: 'smooth' });
    };
    if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));
    // Navegación por teclado con el foco en el carrusel
    track.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); scrollByCard(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); scrollByCard(1); }
    });
}

// Formulario -> WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameGroup = document.getElementById('nameGroup');
    const emailGroup = document.getElementById('emailGroup');
    const messageGroup = document.getElementById('messageGroup');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (input, group, test) => {
        const valid = test(input.value.trim());
        group.classList.toggle('invalid', !valid);
        return valid;
    };
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => input.closest('.form-group').classList.remove('invalid'));
    });
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const vName = validateField(nameInput, nameGroup, v => v.length >= 2);
        const vEmail = validateField(emailInput, emailGroup, v => emailRegex.test(v));
        const vMsg = validateField(messageInput, messageGroup, v => v.length >= 5);
        if (!vName || !vEmail || !vMsg) return;
        const service = document.getElementById('service').value;
        const text = `Hola Derly, soy ${nameInput.value.trim()}.${service ? ` Me interesa: ${service}.` : ''} ${messageInput.value.trim()}`;
        window.open(`https://wa.me/573001234567?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        contactForm.reset();
    });
}
