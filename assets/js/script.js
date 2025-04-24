// Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when clicking a link (mobile)
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });
});

// Sticky Header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 0);
});

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    // Close all other items
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
    // Toggle current item
    item.classList.toggle('active');
  });
});

// Form "Outros" field toggle
const outrosCheckbox = document.getElementById('outros');
const outrosContainer = document.getElementById('outros-servicos-container');

if (outrosCheckbox && outrosContainer) {
  outrosCheckbox.addEventListener('change', () => {
    if (outrosCheckbox.checked) {
      outrosContainer.style.display = 'block';
    } else {
      outrosContainer.style.display = 'none';
    }
  });
}

// Reset error styles
const resetErrors = () => {
  const fields = [nome, email, telefone, veiculo];
  fields.forEach((field) => {
    field.style.borderColor = '#ddd';
  });
};

resetErrors();

// Animation on scroll
window.addEventListener('scroll', function () {
  const animElements = document.querySelectorAll(
    '.service-card, .why-us-item, .gallery-item, .testimonial, .certification-item, .space-item, .mission, .vision, .values'
  );

  animElements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (elementPosition < screenHeight * 0.8) {
      element.classList.add('animate');
    }
  });
});
