// Remoperk — interactividad básica del sitio

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  const yearEl = document.getElementById('year');

  // Año dinámico en el footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Sombra en el navbar al hacer scroll
  const toggleNavbarShadow = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  toggleNavbarShadow();
  window.addEventListener('scroll', toggleNavbarShadow, { passive: true });

  // Menú móvil (hamburguesa)
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');

      mobileMenu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Cerrar el menú móvil al pulsar un enlace
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
