document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Custom Cursor & Magnetic Elements ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        const animateFollower = () => {
            let distX = mouseX - followerX;
            let distY = mouseY - followerY;
            followerX += distX * 0.15;
            followerY += distY * 0.15;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Cursor hover states
        const hoverTargets = document.querySelectorAll('a, button, .video-container, .modal-close, .magnetic');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('cursor-hover');
                cursor.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('cursor-hover');
                cursor.style.opacity = '1';
            });
        });

        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', function(e) {
                const pos = this.getBoundingClientRect();
                const mx = e.clientX - pos.left - pos.width/2;
                const my = e.clientY - pos.top - pos.height/2;
                this.style.transform = `translate(${mx * 0.15}px, ${my * 0.15}px)`;
            });

            el.addEventListener('mouseleave', function() {
                this.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // --- Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400); // Wait for transition
                }
            });
        });
    });

    const videoContainers = document.querySelectorAll('.video-container');

    // --- 3D Tilt Effect on Portfolio Cards ---
    videoContainers.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition for instant mouse tracking
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt (max 8 degrees)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; // Restore smooth transition
            card.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
        });
    });

    // --- Dynamic Video Modal ---
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.modal-close');
    const modalVideoContainer = document.getElementById('modalVideoContainer');

    function openModal(videoUrl) {
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            let videoId = '';
            if (videoUrl.includes('v=')) {
                videoId = videoUrl.split('v=')[1].split('&')[0];
            } else if (videoUrl.includes('youtu.be/')) {
                videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            }
            modalVideoContainer.innerHTML = `
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 12px;"></iframe>
            `;
        } else if (videoUrl.includes('vimeo.com')) {
            let videoId = videoUrl.split('/').pop();
            modalVideoContainer.innerHTML = `
                <iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&title=0&byline=0&portrait=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="border-radius: 12px;"></iframe>
            `;
        } else {
            // Inject video tag
            modalVideoContainer.innerHTML = `
                <video src="${videoUrl}" autoplay controls controlsList="nodownload" style="border-radius: 12px; width: 100%; height: 100%;"></video>
            `;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Remove video element to stop playback instantly
        setTimeout(() => {
            modalVideoContainer.innerHTML = '';
        }, 400); // wait for fade out
    }

    videoContainers.forEach(container => {
        container.addEventListener('click', () => {
            const videoUrl = container.getAttribute('data-video');
            if(videoUrl) openModal(videoUrl);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

});
