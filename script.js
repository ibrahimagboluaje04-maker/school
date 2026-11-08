// Cedar Grove Academy - frontend interactions
// Add this class only when JavaScript is running so content remains visible
// when scripts are blocked or unavailable.
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.site-nav');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.querySelectorAll('[data-current-year]');

  year.forEach((node) => { node.textContent = new Date().getFullYear(); });

  const updateScrollUI = () => {
    const moved = window.scrollY > 24;
    navbar?.classList.toggle('scrolled', moved);
    backToTop?.classList.toggle('show', window.scrollY > 450);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  // Gallery category filters.
  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-category]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.galleryFilter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      galleryItems.forEach((item) => {
        item.hidden = selected !== 'all' && item.dataset.galleryCategory !== selected;
      });
    });
  });

  // Frontend-only enquiry form: validates and stores submissions in this browser.
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      showFormMessage('Please complete the required fields with valid information.', 'error');
      return;
    }

    const formData = Object.fromEntries(new FormData(contactForm).entries());
    try {
      const savedMessages = JSON.parse(localStorage.getItem('cedargroveacademy_enquiries') || '[]');
      savedMessages.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('cedargroveacademy_enquiries', JSON.stringify(savedMessages));
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      showFormMessage('Thank you for contacting Cedar Grove Academy. Your demo enquiry has been saved in this browser.', 'success');
    } catch (error) {
      showFormMessage('Your browser could not save this demo enquiry. Please check your browser storage settings.', 'error');
    }
  });

  function showFormMessage(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
  }
});
