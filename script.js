document.addEventListener('DOMContentLoaded', () => {
  // ========== COLOR-BASED IMAGE SLIDER ==========
    const colorOptions = document.querySelectorAll('.color-option');
    const backgrounds = document.querySelectorAll('.background');
    const slider = document.querySelector('.slider-images');
    const images = Array.from(slider?.children || []);

    let currentImageIndex = 0;
    let currentSelectedOption = null;

    function initializeSlider() {
      if (images.length === 0) return;

      resetClasses();
      images[currentImageIndex].classList.add('active');

      if (images.length > 1) {
        images[(currentImageIndex + 1) % images.length].classList.add('next');
        images[(currentImageIndex - 1 + images.length) % images.length].classList.add('previous');
      }
    }

    function resetClasses() {
      images.forEach(img => {
        img.classList.remove('active', 'next', 'previous', 'inactive');
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
    }

    function updateSliderOnColorChange(selectedOption) {
      const newIndex = parseInt(selectedOption.getAttribute('data-index')) || 0;
      if (newIndex === currentImageIndex) return;

      currentImageIndex = newIndex;
      currentSelectedOption = selectedOption;

      resetClasses();

      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      const nextIndex = (currentImageIndex + 1) % images.length;

      images[currentImageIndex].classList.add('active');
      images[prevIndex].classList.add('previous');
      images[nextIndex].classList.add('next');

      images.forEach((img, idx) => {
        if (![prevIndex, currentImageIndex, nextIndex].includes(idx)) {
          img.classList.add('inactive');
        }
      });

      backgrounds.forEach((bg, index) => {
        bg.style.opacity = index === currentImageIndex ? '1' : '0';
      });
    }

    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        const newImageSrc = option.getAttribute('data-image');
        const targetIndex = parseInt(option.getAttribute('data-index')) || 0;

        if (newImageSrc && images[targetIndex]) {
          images[targetIndex].src = newImageSrc;
        }

        updateSliderOnColorChange(option);
      });
    });

    initializeSlider();

    // ========== CARD BOX SLIDER ==========
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-track .card');
    const carouselPrevBtn = document.getElementById('carousel-box-prev'); // Use unique IDs!
    const carouselNextBtn = document.getElementById('carousel-box-next');

    let currentCardIndex = 0;

    function updateCarousel() {
      if (!cards.length || !track) return;
      const cardWidth = cards[0].offsetWidth + 16;
      track.style.transform = `translateX(-${currentCardIndex * cardWidth}px)`;
    }

    carouselNextBtn?.addEventListener('click', () => {
      if (currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        updateCarousel();
      }
    });

    carouselPrevBtn?.addEventListener('click', () => {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCarousel();
      }
    });

    window.addEventListener('resize', updateCarousel);

    // ========== 3D TILT EFFECT ==========
    function add3DTiltEffect(element, options = {}) {
      const maxRotate = options.maxRotate || 7;
      const scaleOnHover = options.scale || 1.05;
      const translateZ = options.translateZ || 400;

      element.style.transition = 'transform 0.25s ease';

      element.addEventListener('mousemove', e => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * maxRotate;
        const rotateY = ((x - centerX) / centerX) * maxRotate;

        element.style.transform =
          `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover}) translateZ(${translateZ}px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'none';
      });
    }

    document.querySelectorAll('.feature-item').forEach(item => {
      add3DTiltEffect(item);
    });

    const about = document.querySelector('.about');
    if (about) {
      add3DTiltEffect(about);
    }
  // ========== SIMPLE SLIDER (MOVED FROM <script> TAG) ==========
  const slides = document.querySelectorAll('.slider-container .slide');
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000); // 5 seconds

  // ========== SCROLL-TRIGGERED ANIMATIONS WITH 3D EFFECT & BG COLOR ==========
  // Section background color change on scroll
  const sectionBgColors = [
    "#f4f4f4",      // Home/Carousel
    "#e3f0ff",      // About
    "#f9fbe7",      // Skills
    "#fff3e0",      // Projects
    "#f3e8fd",      // Contact
  ];
  const sectionSelectors = [
    ".project-carousel-fullscreen",
    ".about",
    ".skills",
    ".projects",
    ".contact"
  ];

  function setBodyBgBySection() {
    let found = false;
    for (let i = 0; i < sectionSelectors.length; i++) {
      const section = document.querySelector(sectionSelectors[i]);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          document.body.style.background = sectionBgColors[i];
          found = true;
          break;
        }
      }
    }
    if (!found) {
      document.body.style.background = ""; // fallback
    }
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight - 60 && // 60px offset for header
      rect.bottom > 60
    );
  }

  function animateOnScroll() {
    const animatedEls = document.querySelectorAll(
      '.animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-slide-up, .animate-border-grow, .animate-3d'
    );
    animatedEls.forEach(el => {
      if (isInViewport(el)) {
        el.classList.add('visible');
        // 3D pop-in effect
        if (el.classList.contains('animate-3d')) {
          el.style.transform = 'perspective(800px) rotateY(0deg) scale(1.04)';
          el.style.transition = 'transform 0.7s cubic-bezier(.4,0,.2,1), box-shadow 0.7s cubic-bezier(.4,0,.2,1)';
          el.style.boxShadow = '0 12px 40px 0 rgba(10,132,255,0.18), 0 0 32px 0 #e040fb44';
        }
      } else {
        el.classList.remove('visible');
        if (el.classList.contains('animate-3d')) {
          el.style.transform = 'perspective(800px) rotateY(25deg) scale(0.92)';
          el.style.boxShadow = 'none';
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    animateOnScroll();
    setBodyBgBySection();
  });
  window.addEventListener('resize', () => {
    animateOnScroll();
    setBodyBgBySection();
  });
  window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    setBodyBgBySection();
  });

  // ===== SLIDER LOGIC FOR HOME SECTION =====
  const homeSlides = document.querySelectorAll('.slider-container .slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const slideTitle = document.getElementById('slide-title');
  let currentSlide = 0;
  let slideInterval;

  // Get project names from each slide's h3
  const projectNames = Array.from(homeSlides).map(slide => {
    const h3 = slide.querySelector('h3');
    return h3 ? h3.textContent : '';
  });

  function showHomeSlide(idx) {
    homeSlides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === idx) {
        slide.classList.add('active');
      } else if (i === (idx - 1 + homeSlides.length) % homeSlides.length) {
        slide.classList.add('prev');
      }
    });
    if (slideTitle && projectNames[idx]) {
      slideTitle.textContent = projectNames[idx];
    }
    currentSlide = idx;
  }

  function nextHomeSlide() {
    showHomeSlide((currentSlide + 1) % homeSlides.length);
  }

  function prevHomeSlide() {
    showHomeSlide((currentSlide - 1 + homeSlides.length) % homeSlides.length);
  }

  prevBtn?.addEventListener('click', () => {
    prevHomeSlide();
    resetHomeInterval();
  });
  nextBtn?.addEventListener('click', () => {
    nextHomeSlide();
    resetHomeInterval();
  });

  function startHomeInterval() {
    slideInterval = setInterval(nextHomeSlide, 5000);
  }

  function resetHomeInterval() {
    clearInterval(slideInterval);
    startHomeInterval();
  }

  showHomeSlide(0);
  startHomeInterval();
});
