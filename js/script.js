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

  // Carrusel del catálogo: la pieza central queda grande y nítida,
  // las de los lados se ven más pequeñas y opacas.
  const catalogTrack = document.getElementById('catalogTrack');
  if (catalogTrack) {
    const slides = Array.from(catalogTrack.querySelectorAll('.catalog-slide'));
    const prevBtn = document.getElementById('catalogPrev');
    const nextBtn = document.getElementById('catalogNext');

    const setSidePadding = () => {
      if (!slides.length) return;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const pad = Math.max((catalogTrack.clientWidth - slideWidth) / 2, 0);
      catalogTrack.style.paddingLeft = `${pad}px`;
      catalogTrack.style.paddingRight = `${pad}px`;
    };

    const updateScale = () => {
      const trackRect = catalogTrack.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const dist = Math.abs(center - slideCenter);
        const maxDist = trackRect.width / 2 + rect.width / 2;
        const ratio = Math.min(dist / maxDist, 1);
        const scale = 1 - ratio * 0.3;
        const opacity = 1 - ratio * 0.65;
        slide.style.transform = `scale(${scale})`;
        slide.style.opacity = opacity.toFixed(2);
      });
    };

    const getActiveIndex = () => {
      const trackRect = catalogTrack.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let closest = 0;
      let closestDist = Infinity;
      slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const dist = Math.abs(center - (rect.left + rect.width / 2));
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      return closest;
    };

    const scrollToSlide = (index) => {
      const clamped = Math.max(0, Math.min(index, slides.length - 1));
      const slide = slides[clamped];
      const trackRect = catalogTrack.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const offset = slideRect.left - trackRect.left - (catalogTrack.clientWidth - slideRect.width) / 2;
      catalogTrack.scrollBy({ left: offset, behavior: 'smooth' });
    };

    let ticking = false;
    catalogTrack.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateScale();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    if (prevBtn) prevBtn.addEventListener('click', () => scrollToSlide(getActiveIndex() - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollToSlide(getActiveIndex() + 1));

    window.addEventListener('resize', () => {
      setSidePadding();
      updateScale();
    });

    setSidePadding();
    updateScale();
  }
});
