// script.js
// DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initScrollAnimations();
    initCounters();
    initCarousel();
    initSmoothScroll();
    initNav();
    initScrollProgress();
    initScrollToTop();
    initFormSubmission();
});

/* Hero Background Animation with Canvas */
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 194, 168, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* Scroll-based Fade In */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .gallery-img');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* Animated Counters */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => countUp(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

/* Testimonial Carousel */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let index = 0;

    const showSlide = (i) => {
        index = (i + cards.length) % cards.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    };

    prevBtn.addEventListener('click', () => showSlide(index - 1));
    nextBtn.addEventListener('click', () => showSlide(index + 1));

    // Auto-slide every 6 seconds
    setInterval(() => showSlide(index + 1), 6000);
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* Scroll Progress Bar */
function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const scroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scroll / height) * 100;
        progress.style.width = scrolled + '%';
    });
}

/* Scroll to Top Button */
function initScrollToTop() {
    const btn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* Form Submission (Front-end only) */
function initFormSubmission() {
    const form = document.getElementById('contactForm');
    if (!form) return; // contact form removed on purpose — nothing to attach
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    });
}

/* Navigation: mobile toggle and active link highlighting */
function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!toggle || !links) return;

    const closeMenu = () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('open');
        links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked (mobile)
    navLinks.forEach(a => a.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeMenu();
    }));

    // Active link on scroll
    const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    const onScroll = () => {
        const scrollPos = window.scrollY + 120; // offset for fixed nav
        let current = null;
        for (const sec of sections) {
            if (sec.offsetTop <= scrollPos) current = sec;
        }
        navLinks.forEach(a => a.classList.remove('active'));
        if (current) {
            const activeLink = Array.from(navLinks).find(a => a.getAttribute('href') === `#${current.id}`);
            if (activeLink) activeLink.classList.add('active');
        }
    };

    window.addEventListener('scroll', onScroll);
    // initial call
    onScroll();
}