/* =========================================================
   GINGA ID — Interações do site
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // fecha o menu ao clicar em um link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    const panel = trigger.nextElementSibling;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // fecha todos os outros itens
      triggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      // alterna o item atual
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      panel.style.maxHeight = isExpanded ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Revelação suave ao entrar na viewport ---------- */
  const revealTargets = document.querySelectorAll(
    '.product-card, .step, .benefit-card, .audience-card, .diff-card, .contact-card, .p-step'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));

    // Rede de segurança: garante que nada fique invisível permanentemente
    // (ex.: screenshots automatizados, navegação por teclado sem rolagem suave).
    window.addEventListener('load', () => {
      setTimeout(() => {
        revealTargets.forEach(el => el.classList.add('is-visible'));
      }, 2500);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

});
