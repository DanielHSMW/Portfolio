/**
 * Main Initialization for Portfolio
 * Alle Skripte werden hier logisch in Module unterteilt, 
 * um die Wartbarkeit und Lesbarkeit zu maximieren.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Prevent jump on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    initScrollAnimations();
    initParallaxBlobs();
    initNavigation();
    initArbeitsbereiche();
});

/* ==========================================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Observe standard sections
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // Observe projects grid specifically to trigger staggered CSS animations
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        observer.observe(projectsGrid);
    }
}

/* ==========================================================================
   PARALLAX BLOBS (Background Depth)
   ========================================================================== */
function initParallaxBlobs() {
    const blobs = document.querySelectorAll('.blob');
    if (!blobs.length) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        if (blobs[0]) {
            blobs[0].style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        }
        if (blobs[1]) {
            blobs[1].style.transform = `translate(${x * -50}px, ${y * -50}px)`;
        }
    });
}

/* ==========================================================================
   MOBILE NAVIGATION (Hamburger Menu)
   ========================================================================== */
function initNavigation() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) return;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('is-active');
            navMenu.classList.remove('active');
        });
    });
}



/* ==========================================================================
   ARBEITSBEREICHE (Interactive Cards)
   ========================================================================== */
function initArbeitsbereiche() {
    const interactiveCards = document.querySelectorAll('.interactive-card');
    
    interactiveCards.forEach(card => {
        // Clicking the card opens details
        card.addEventListener('click', function(e) {
            // Ignore clicks on links or the back button
            if (e.target.closest('.back-btn') || e.target.closest('.detail-link')) {
                return;
            }
            this.classList.add('show-details');
        });

        // Clicking the back button closes details
        const backBtn = card.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // prevent opening again
                card.classList.remove('show-details');
            });
        }
        
        // Handle keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (!e.target.closest('.back-btn') && !e.target.closest('.detail-link')) {
                    e.preventDefault();
                    this.classList.add('show-details');
                }
            }
        });
    });
}
