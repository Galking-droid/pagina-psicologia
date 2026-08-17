const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

const options = {
    threshold: 0.6 // Activa el cambio cuando el 60% de la sección es visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                // Compara el id de la sección con el href del enlace (sin el #)
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Animaciones de entrada al hacer scroll (reveal)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Hamburger menu logic
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
    if (menuBackdrop) {
        menuBackdrop.classList.toggle('show', isOpen);
    }
    return isOpen;
};

if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
        // Al abrir, mueve el foco al primer enlace del menú
        if (toggleMenu()) {
            navMenu.querySelector('a')?.focus();
        }
    });

    // Cerrar el menú al hacer clic en un enlace (para el scroll suave)
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar el menú al hacer clic en el backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', () => toggleMenu(false));
    }

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('open')) {
            toggleMenu(false);
        }
    });

    // Cerrar el menú al hacer scroll
    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('open')) {
            toggleMenu(false);
        }
    });

    // Cerrar el menú con la tecla Escape y devolver el foco al botón
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu(false);
            hamburgerMenu.focus();
        }
    });
}

// Lógica para mostrar/ocultar el botón "Volver Arriba"
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Formulario de contacto: valida y abre WhatsApp con el mensaje
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

    const clearErrors = () => {
        [nameGroup, emailGroup, messageGroup].forEach(group => {
            group.classList.remove('invalid');
        });
    };

    // Limpia el error mientras el usuario escribe
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('invalid');
        });
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        const validName = validateField(nameInput, nameGroup, (value) => value.length >= 2);
        const validEmail = validateField(emailInput, emailGroup, (value) => emailRegex.test(value));
        const validMessage = validateField(messageInput, messageGroup, (value) => value.length >= 5);

        if (!validName || !validEmail || !validMessage) {
            return;
        }

        const service = document.getElementById('service').value;
        const message = messageInput.value.trim();

        const text = `Hola Derly, soy ${nameInput.value.trim()}.${service ? ` Me interesa: ${service}.` : ''} ${message}`;

        const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank', 'noopener');
        contactForm.reset();
    });
}