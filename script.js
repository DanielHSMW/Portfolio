/**
 * Main Initialization for Portfolio
 * Alle Skripte werden hier logisch in Module unterteilt, 
 * um die Wartbarkeit und Lesbarkeit zu maximieren.
 */
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallaxBlobs();
    initNavigation();
    initVideoPlayer();
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
   CUSTOM VIDEO PLAYER
   ========================================================================== */
function initVideoPlayer() {
    const videoWrapper = document.getElementById('custom-player-wrapper');
    const video = document.getElementById('my-video');
    const playOverlay = document.querySelector('.play-overlay');
    const videoControls = document.querySelector('.video-controls');
    
    if (!videoWrapper || !video || !playOverlay) return;

    // Prevent click events on the controls bar from bubbling up to the wrapper
    if (videoControls) {
        videoControls.addEventListener('click', (e) => e.stopPropagation());
    }

    /* --- Play/Pause Logic --- */
    const playIconSvg = document.getElementById('play-icon-svg');
    const pauseIconSvg = document.getElementById('pause-icon-svg');
    const playPauseBtn = document.getElementById('play-pause-btn');
    let isFirstPlay = true;

    const togglePlay = () => {
        if (video.paused) {
            video.play();
            // Hide the large initial overlay
            if (isFirstPlay) {
                playOverlay.style.opacity = '0';
                setTimeout(() => { playOverlay.style.display = 'none'; }, 300);
                isFirstPlay = false;
            }
            if (playIconSvg) playIconSvg.style.display = 'none';
            if (pauseIconSvg) pauseIconSvg.style.display = 'block';
        } else {
            video.pause();
            if (playIconSvg) playIconSvg.style.display = 'block';
            if (pauseIconSvg) pauseIconSvg.style.display = 'none';
        }
    };

    // Click anywhere on the video wrapper to toggle play/pause
    videoWrapper.addEventListener('click', (e) => {
        if (videoControls && !videoControls.contains(e.target)) {
            togglePlay();
        }
    });

    // Dedicated Play/Pause button in control bar
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });
    }

    // Reset icons when video ends
    video.addEventListener('ended', () => {
        if (playIconSvg) playIconSvg.style.display = 'block';
        if (pauseIconSvg) pauseIconSvg.style.display = 'none';
    });

    /* --- Progress Bar Logic --- */
    initVideoProgressBar(video);

    /* --- Volume Controls --- */
    initVideoVolume(video);
}

function initVideoProgressBar(video) {
    const videoProgress = document.getElementById('vid-progress');
    const progressContainer = document.querySelector('.video-progress-container');
    if (!videoProgress || !progressContainer) return;

    let isDragging = false;

    const updateProgress = (e) => {
        const rect = progressContainer.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        clickX = Math.max(0, Math.min(clickX, rect.width)); // Clamp between 0 and width
        
        const percentage = (clickX / rect.width);
        video.currentTime = percentage * video.duration;
        videoProgress.style.width = (percentage * 100) + '%';
    };

    video.addEventListener('timeupdate', () => {
        if (video.duration && !isDragging) {
            const percentage = (video.currentTime / video.duration) * 100;
            videoProgress.style.width = percentage + '%';
        }
    });

    progressContainer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDragging = true;
        updateProgress(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault(); // Prevent text selection
            updateProgress(e);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    progressContainer.addEventListener('click', (e) => e.stopPropagation());
}

function initVideoVolume(video) {
    const volumeSlider = document.getElementById('volume-slider');
    const muteUnmuteBtn = document.getElementById('mute-unmute-btn');
    const volumeIcon = document.getElementById('volume-icon');
    const mutedIcon = document.getElementById('muted-icon');

    if (!volumeSlider || !muteUnmuteBtn) return;

    volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        video.volume = volumeSlider.value;
        video.muted = video.volume == 0;
        
        if (video.muted) {
            if (volumeIcon) volumeIcon.style.display = 'none';
            if (mutedIcon) mutedIcon.style.display = 'block';
        } else {
            if (volumeIcon) volumeIcon.style.display = 'block';
            if (mutedIcon) mutedIcon.style.display = 'none';
        }
    });

    volumeSlider.addEventListener('mousedown', (e) => e.stopPropagation());
    volumeSlider.addEventListener('click', (e) => e.stopPropagation());

    muteUnmuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (video.muted) {
            volumeSlider.value = 0;
            if (volumeIcon) volumeIcon.style.display = 'none';
            if (mutedIcon) mutedIcon.style.display = 'block';
        } else {
            volumeSlider.value = video.volume || 1; 
            if (volumeSlider.value == 0) { 
                volumeSlider.value = 1; 
                video.volume = 1; 
            }
            if (volumeIcon) volumeIcon.style.display = 'block';
            if (mutedIcon) mutedIcon.style.display = 'none';
        }
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
