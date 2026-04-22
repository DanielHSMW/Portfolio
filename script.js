document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Intersection Observer für Scroll-Animationen
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Feuert, wenn 15% des Elements sichtbar sind
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Element nicht weiter beobachten, sobald es eingeblendet wurde
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Alle normalen Sektionen observieren
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // Die Project-Grid separat observieren, um den Staggering-Effekt auf die Karten auszulösen
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        observer.observe(projectsGrid);
    }

    // 2. Parallax-Effekt für die dezenten Background-Blobs (Gibt der Seite etwas mehr Tiefe)
    const blobs = document.querySelectorAll('.blob');
    
    window.addEventListener('mousemove', (e) => {
        // Berechne die relative Mausposition
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Bewege die Blobs leicht entgegen oder mit der Maus
        if(blobs[0]) {
            blobs[0].style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        }
        if(blobs[1]) {
            blobs[1].style.transform = `translate(${x * -50}px, ${y * -50}px)`;
        }
    });

    // --- 3. Hamburger Menu Logic ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });
    }

    // --- 4. Video Player Custom Play Logic ---
    const videoWrapper = document.getElementById('custom-player-wrapper');
    const video = document.getElementById('my-video');
    const playOverlay = document.querySelector('.play-overlay');

    if (videoWrapper && video && playOverlay) {
        // Close menu if a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('active');
            });
        });

        const videoControls = document.querySelector('.video-controls');
        if (videoControls) {
            videoControls.addEventListener('click', (e) => e.stopPropagation());
        }

        const playIconSvg = document.getElementById('play-icon-svg');
        const pauseIconSvg = document.getElementById('pause-icon-svg');
        const playPauseBtn = document.getElementById('play-pause-btn');

        let isFirstPlay = true;

        const togglePlay = () => {
            if (video.paused) {
                video.play();
                if (isFirstPlay) {
                    playOverlay.style.opacity = '0';
                    setTimeout(() => { playOverlay.style.display = 'none'; }, 300);
                    isFirstPlay = false;
                }
                if(playIconSvg) playIconSvg.style.display = 'none';
                if(pauseIconSvg) pauseIconSvg.style.display = 'block';
            } else {
                video.pause();
                if(playIconSvg) playIconSvg.style.display = 'block';
                if(pauseIconSvg) pauseIconSvg.style.display = 'none';
            }
        };

        videoWrapper.addEventListener('click', (e) => {
            if (videoControls && !videoControls.contains(e.target)) {
                togglePlay();
            }
        });

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });
        }

        // Overlay reappears when finished
        video.addEventListener('ended', () => {
            if(playIconSvg) playIconSvg.style.display = 'block';
            if(pauseIconSvg) pauseIconSvg.style.display = 'none';
        });

        // Progress Bar Logic
        const videoProgress = document.getElementById('vid-progress');
        const progressContainer = document.querySelector('.video-progress-container');

        if (videoProgress && progressContainer) {
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

            progressContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Volume Logic
        const volumeSlider = document.getElementById('volume-slider');
        const muteUnmuteBtn = document.getElementById('mute-unmute-btn');
        const volumeIcon = document.getElementById('volume-icon');
        const mutedIcon = document.getElementById('muted-icon');

        if (volumeSlider && muteUnmuteBtn) {
            volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                video.volume = volumeSlider.value;
                video.muted = video.volume == 0;
                
                if (video.muted) {
                    volumeIcon.style.display = 'none';
                    mutedIcon.style.display = 'block';
                } else {
                    volumeIcon.style.display = 'block';
                    mutedIcon.style.display = 'none';
                }
            });

            volumeSlider.addEventListener('mousedown', (e) => e.stopPropagation());
            volumeSlider.addEventListener('click', (e) => e.stopPropagation());

            muteUnmuteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                if (video.muted) {
                    volumeSlider.value = 0;
                    volumeIcon.style.display = 'none';
                    mutedIcon.style.display = 'block';
                } else {
                    volumeSlider.value = video.volume || 1; 
                    if(volumeSlider.value == 0) { volumeSlider.value = 1; video.volume = 1; }
                    volumeIcon.style.display = 'block';
                    mutedIcon.style.display = 'none';
                }
            });
        }
    }
});
