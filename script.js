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

// Form Validation
const orcamentoForm = document.getElementById('orcamento-form');
if (orcamentoForm) {
  orcamentoForm.addEventListener('submit', function (e) {
    let isValid = true;
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const veiculo = document.getElementById('veiculo');
    const checkboxes = document.querySelectorAll('input[name="servicos[]"]');

    // Reset error styles
    const resetErrors = () => {
      const fields = [nome, email, telefone, veiculo];
      fields.forEach((field) => {
        field.style.borderColor = '#ddd';
      });
    };

    resetErrors();

    // Validate required fields
    if (nome.value.trim() === '') {
      nome.style.borderColor = 'red';
      isValid = false;
    }

    if (email.value.trim() === '') {
      email.style.borderColor = 'red';
      isValid = false;
    } else {
      // Simple email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value)) {
        email.style.borderColor = 'red';
        isValid = false;
      }
    }

    if (telefone.value.trim() === '') {
      telefone.style.borderColor = 'red';
      isValid = false;
    }

    if (veiculo.value.trim() === '') {
      veiculo.style.borderColor = 'red';
      isValid = false;
    }

    // Check if at least one service is selected
    let isServiceSelected = false;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        isServiceSelected = true;
      }
    });

    if (!isServiceSelected) {
      checkboxes.forEach((checkbox) => {
        checkbox.parentElement.style.color = 'red';
      });
      isValid = false;
    }

    // Validate "outros" field if checked
    if (outrosCheckbox && outrosCheckbox.checked) {
      const outrosServicos = document.getElementById('outros-servicos');
      if (outrosServicos.value.trim() === '') {
        outrosServicos.style.borderColor = 'red';
        isValid = false;
      }
    }

    if (!isValid) {
      e.preventDefault();
      // Scroll to first error
      const firstError = document.querySelector(
        'input[style*="border-color: red"]'
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Show error message
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  });
}

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
