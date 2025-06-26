// Global Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// Navigation Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Slideshow Functions
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function changeSlide(direction) {
    if (direction === 1) {
        nextSlide();
    } else {
        prevSlide();
    }
    resetSlideInterval();
}

function currentSlideIndex(index) {
    showSlide(index - 1);
    resetSlideInterval();
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function initSlideshow() {
    if (slides.length > 0) {
        showSlide(0);
        slideInterval = setInterval(nextSlide, 5000);
        
        // Pause slideshow on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            slideshowContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }
}

// Lookbook Filter Functions
function initLookbookFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Lightbox Functions
function openLightbox(button) {
    const galleryItem = button.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const title = galleryItem.querySelector('h3').textContent;
    const description = galleryItem.querySelector('p').textContent;
    const price = galleryItem.querySelector('.price').textContent;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxPrice = document.getElementById('lightbox-price');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxPrice.textContent = price;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add fade-in animation
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        // Close lightbox when clicking on background
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
}

// Contact Form Functions
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = field.parentNode.querySelector('.error-message');
    
    let errorMessage = '';
    
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                errorMessage = 'This field is required';
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
            } else if (!isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'subject':
            if (!value) {
                errorMessage = 'Please select a subject';
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (errorMessage) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Validate all fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form and button state
        form.reset();
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    }, 2000);
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on Scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.trend-card, .gallery-item, .tip-card, .team-member, .philosophy-item, .quick-tip, .faq-item');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.slide.active img');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Style Tips Card Interactions
function initStyleTipsInteractions() {
    const tipCards = document.querySelectorAll('.tip-card');
    
    tipCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSlideshow();
    initLookbookFilters();
    initLightbox();
    initContactForm();
    initNewsletterForm();
    initBackToTop();
    initSmoothScrolling();
    initScrollAnimations();
    initParallaxEffect();
    initLazyLoading();
    initStyleTipsInteractions();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any size-dependent elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.transition = 'none';
        setTimeout(() => {
            item.style.transition = '';
        }, 100);
    });
});

// Handle page visibility change (pause/resume slideshow)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(slideInterval);
    } else {
        if (slides.length > 0) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
});

// Global functions for HTML onclick handlers
window.changeSlide = changeSlide;
window.currentSlide = currentSlideIndex;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;