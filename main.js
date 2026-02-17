/* ═══════════════════════════════════════════════════════════════
   THE SOUL ART - Main JavaScript
   Handles navbar, mobile menu, gallery tabs, form logic, and animations
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

    // ═══════════════════════════════════════════════════════════════
    // NAVBAR - Scroll Effect
    // ═══════════════════════════════════════════════════════════════

    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // ═══════════════════════════════════════════════════════════════
    // MOBILE MENU
    // ═══════════════════════════════════════════════════════════════

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // GALLERY TABS
    // ═══════════════════════════════════════════════════════════════

    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const gallerySections = document.querySelectorAll('.gallery-section');

    if (galleryTabs.length > 0) {
        galleryTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const category = this.getAttribute('data-category');

                // Update active tab
                galleryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding gallery section
                gallerySections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === category + '-gallery') {
                        section.classList.add('active');
                    }
                });
            });
        });

        // Handle hash on page load (e.g., gallery.html#arabic)
        const hash = window.location.hash.replace('#', '');
        if (hash && ['bridal', 'arabic', 'designer', 'indian', 'engagement', 'baby-shower', 'festive'].includes(hash)) {
            const targetTab = document.querySelector(`[data-category="${hash}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BOOKING FORM - Conditional Fields
    // ═══════════════════════════════════════════════════════════════

    const mehendiStyleSelect = document.getElementById('mehendiStyle');
    const brideStoryField = document.getElementById('brideStoryField');
    const bookingForm = document.getElementById('bookingForm');

    if (mehendiStyleSelect && brideStoryField) {
        mehendiStyleSelect.addEventListener('change', function () {
            if (this.value === 'bridal') {
                brideStoryField.classList.remove('hidden');
            } else {
                brideStoryField.classList.add('hidden');
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;

            // Collect form data
            const name = document.getElementById('name').value.trim();
            const eventDate = document.getElementById('eventDate').value;
            const venue = document.getElementById('venue').value.trim();
            const mehendiStyle = document.getElementById('mehendiStyle').value;
            const brideStory = document.getElementById('brideStory') ? document.getElementById('brideStory').value.trim() : '';

            // Format mehendi style for display
            const styleLabels = {
                'bridal': 'Bridal Mehendi',
                'sider': 'Sider / Family',
                'guest': 'Guest Mehendi'
            };
            const styleLabel = styleLabels[mehendiStyle] || mehendiStyle;

            // Format date for display
            const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Not specified';

            // Build WhatsApp message (using text markers for better compatibility)
            let message = `*--- NEW BOOKING INQUIRY ---*\n`;
            message += `_from The Soul Art Website_\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Event Date:* ${formattedDate}\n`;
            message += `*Venue/City:* ${venue}\n`;
            message += `*Mehendi Style:* ${styleLabel}\n`;

            if (brideStory && mehendiStyle === 'bridal') {
                message += `\n*Bride's Story & Vision:*\n${brideStory}\n`;
            }

            message += `\n*----------------------------*`;

            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = '918291766448'; // Your WhatsApp number
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Loading state
            submitBtn.innerHTML = '<span>Opening WhatsApp...</span>';
            submitBtn.disabled = true;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Success state
            setTimeout(function () {
                submitBtn.innerHTML = '<span>✓ WhatsApp Opened</span>';
                submitBtn.style.borderColor = '#25D366';

                // Reset after delay
                setTimeout(function () {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.borderColor = '';
                    bookingForm.reset();
                    if (brideStoryField) {
                        brideStoryField.classList.add('hidden');
                    }
                }, 3000);
            }, 500);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SCROLL ANIMATIONS - Intersection Observer
    // ═══════════════════════════════════════════════════════════════

    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements if IntersectionObserver not supported
        fadeElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ═══════════════════════════════════════════════════════════════

    const anchorLinks = document.querySelectorAll('a[href*="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle same-page anchors
            if (href.startsWith('#') || (href.includes('#') && href.split('#')[0] === '' || href.split('#')[0] === window.location.pathname.split('/').pop())) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // INPUT FOCUS EFFECTS
    // ═══════════════════════════════════════════════════════════════

    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');

    formInputs.forEach(input => {
        // Add focus class for styling
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

});
