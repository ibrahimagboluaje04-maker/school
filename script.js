// Cedar Grove Academy - frontend interactions
// Bootstrap handles the mobile navigation collapse.
// This script does not manually open or close the menu.

document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.querySelector('.site-nav');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.querySelectorAll('[data-current-year]');

  // Automatically update copyright year
  year.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Navigation shadow and back-to-top button
  const updateScrollUI = () => {

    const moved = window.scrollY > 24;

    navbar?.classList.toggle('scrolled', moved);

    backToTop?.classList.toggle(
      'show',
      window.scrollY > 450
    );

  };

  updateScrollUI();

  window.addEventListener(
    'scroll',
    updateScrollUI,
    { passive: true }
  );

  // Back-to-top functionality
  backToTop?.addEventListener('click', () => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

  // Reveal elements when they enter the screen
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add('visible');

            currentObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      observer.observe(item);
    });

  } else {

    revealItems.forEach((item) => {
      item.classList.add('visible');
    });

  }

  // Gallery category filters
  const filterButtons = document.querySelectorAll(
    '[data-gallery-filter]'
  );

  const galleryItems = document.querySelectorAll(
    '[data-gallery-category]'
  );

  filterButtons.forEach((button) => {

    button.addEventListener('click', () => {

      const selected = button.dataset.galleryFilter;

      filterButtons.forEach((item) => {

        item.classList.toggle(
          'active',
          item === button
        );

      });

      galleryItems.forEach((item) => {

        item.hidden =
          selected !== 'all' &&
          item.dataset.galleryCategory !== selected;

      });

    });

  });

  // Contact form
  // This is frontend-only and saves enquiries in this browser.
  const contactForm = document.querySelector('#contactForm');

  const formStatus = document.querySelector('#formStatus');

  contactForm?.addEventListener('submit', (event) => {

    event.preventDefault();

    if (!contactForm.checkValidity()) {

      contactForm.classList.add('was-validated');

      showFormMessage(
        'Please complete the required fields with valid information.',
        'error'
      );

      return;

    }

    const formData = Object.fromEntries(
      new FormData(contactForm).entries()
    );

    try {

      const savedMessages = JSON.parse(
        localStorage.getItem('cedargroveacademy_enquiries') || '[]'
      );

      savedMessages.push({

        ...formData,

        submittedAt: new Date().toISOString()

      });

      localStorage.setItem(
        'cedargroveacademy_enquiries',
        JSON.stringify(savedMessages)
      );

      contactForm.reset();

      contactForm.classList.remove('was-validated');

      showFormMessage(
        'Thank you for contacting Cedar Grove Academy. Your demo enquiry has been saved in this browser.',
        'success'
      );

    } catch (error) {

      showFormMessage(
        'Your browser could not save this demo enquiry. Please check your browser storage settings.',
        'error'
      );

    }

  });

  // Display form messages
  function showFormMessage(message, type) {

    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.className = `form-status show ${type}`;

  }

});
