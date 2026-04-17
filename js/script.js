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

// Hamburger menu logic
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');

if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        // Toggle icon between bars and times
        const icon = hamburgerMenu.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a nav link is clicked (for smooth scroll)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburgerMenu.querySelector('i').classList.remove('fa-times');
            hamburgerMenu.querySelector('i').classList.add('fa-bars');
        });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            const icon = hamburgerMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar el menú al hacer scroll
    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            const icon = hamburgerMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
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