document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Year ---
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // --- Active Page Navigation Link ---
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (currentPath === 'index.html' && linkHref === '#') || (currentPath === 'index.html' && linkHref.startsWith('#'))) {
            link.classList.add('active-page');
        } else {
            link.classList.remove('active-page');
        }
    });

    // --- Mobile Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // --- Custom Cursor & Magnetic Elements ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
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
        const hoverTargets = document.querySelectorAll('a, button, .video-container, .modal-close, .magnetic, .form-input');
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
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Scroll Animations (IntersectionObserver) ---
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

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
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
                        }, 400); 
                    }
                });
            });
        });
    }

    // --- 3D Tilt Effect on Portfolio Cards ---
    const videoContainers = document.querySelectorAll('.video-container');
    if (videoContainers.length > 0) {
        videoContainers.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
            });
        });
    }

    // --- Dynamic Video Modal ---
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.modal-close');
    const modalVideoContainer = document.getElementById('modalVideoContainer');

    function openModal(videoUrl) {
        if (!modal || !modalVideoContainer) return;
        
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
            modalVideoContainer.innerHTML = `
                <video src="${videoUrl}" autoplay controls controlsList="nodownload" style="border-radius: 12px; width: 100%; height: 100%;"></video>
            `;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal || !modalVideoContainer) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            modalVideoContainer.innerHTML = '';
        }, 400); 
    }

    if (videoContainers.length > 0) {
        videoContainers.forEach(container => {
            container.addEventListener('click', () => {
                const videoUrl = container.getAttribute('data-video');
                if (videoUrl) openModal(videoUrl);
            });
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- Google Sheets integration fallback logic (Local Storage DB) ---
    const GOOGLE_SCRIPT_URL = ''; // Replace with Google Apps Script Web App URL if deploying to real Sheets

    // Helper to log entries to Local Storage Database
    function saveToLocalStorageDb(key, data) {
        const currentData = JSON.parse(localStorage.getItem(key)) || [];
        currentData.push(data);
        localStorage.setItem(key, JSON.stringify(currentData));
    }

    // --- Email Collector (Home Page Form) ---
    const emailForm = document.getElementById('emailCollectorForm');
    const emailAlert = document.getElementById('emailAlert');

    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = emailForm.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value.trim();
            const timestamp = new Date().toLocaleString();
            const record = { email, timestamp };

            // Save locally
            saveToLocalStorageDb('subscribers', record);

            // POST to Google Sheets (if URL configured)
            if (GOOGLE_SCRIPT_URL) {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(record)
                }).catch(err => console.error('Google Sheets submission failed:', err));
            }

            // UI Feedback
            if (emailAlert) {
                emailAlert.textContent = "Thank you for subscribing! We've registered your interest.";
                emailAlert.className = "alert-message alert-success";
                emailAlert.style.display = "block";
            }
            emailForm.reset();
            setTimeout(() => { if (emailAlert) emailAlert.style.display = "none"; }, 5000);
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contactUsForm');
    const contactAlert = document.getElementById('contactAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('name').value.trim();
            const emailVal = document.getElementById('email').value.trim();
            const phoneVal = document.getElementById('phone').value.trim();
            const messageVal = document.getElementById('message').value.trim();
            const timestamp = new Date().toLocaleString();

            const record = { name: nameVal, email: emailVal, phone: phoneVal, message: messageVal, timestamp };

            // Save locally
            saveToLocalStorageDb('submissions', record);

            // POST to Google Sheets (if URL configured)
            if (GOOGLE_SCRIPT_URL) {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(record)
                }).catch(err => console.error('Google Sheets submission failed:', err));
            }

            // UI Feedback
            if (contactAlert) {
                contactAlert.textContent = "Your request was submitted successfully! We'll get back to you shortly.";
                contactAlert.className = "alert-message alert-success";
                contactAlert.style.display = "block";
            }
            contactForm.reset();
            setTimeout(() => { if (contactAlert) contactAlert.style.display = "none"; }, 5000);
        });
    }

    // --- Initialize Local Storage DB with demo data if empty ---
    if (!localStorage.getItem('subscribers')) {
        const demoSubscribers = [
            { email: "dev@creatorhub.com", timestamp: "7/14/2026, 10:15:30 AM" },
            { email: "marketing@voguemedia.co", timestamp: "7/14/2026, 11:42:01 AM" },
            { email: "jason.reel@gmail.com", timestamp: "7/14/2026, 2:05:12 PM" }
        ];
        localStorage.setItem('subscribers', JSON.stringify(demoSubscribers));
    }

    if (!localStorage.getItem('submissions')) {
        const demoSubmissions = [
            {
                name: "Rohan Verma",
                email: "rohan@startup.in",
                phone: "+91 98765 43210",
                message: "Need a monthly editor for 15 YouTube Shorts and 4 long-form videos. Vibe is clean and fast-paced editing.",
                timestamp: "7/14/2026, 9:30:15 AM"
            },
            {
                name: "Sarah Jenkins",
                email: "s.jenkins@flowdigital.com",
                phone: "+1 (555) 321-7654",
                message: "Looking to outsource high-end color grading and sound design for our upcoming clothing brand launch campaign.",
                timestamp: "7/14/2026, 12:15:00 PM"
            },
            {
                name: "Tanmay Bhatia",
                email: "tanmay@gamingleague.gg",
                phone: "+91 99999 88888",
                message: "Urgent gaming montage editing needed for our esports team highlights. Budget is open.",
                timestamp: "7/14/2026, 3:10:45 PM"
            }
        ];
        localStorage.setItem('submissions', JSON.stringify(demoSubmissions));
    }

    // --- Admin Dashboard Loader (Database view) ---
    const subscribersTableBody = document.getElementById('subscribersTableBody');
    const submissionsTableBody = document.getElementById('submissionsTableBody');

    // Fill Subscribers Table
    if (subscribersTableBody) {
        const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        if (subscribers.length === 0) {
            subscribersTableBody.innerHTML = `<tr><td colspan="2" style="text-align: center;">No subscriptions recorded yet.</td></tr>`;
        } else {
            subscribersTableBody.innerHTML = subscribers.map(sub => `
                <tr>
                    <td>${sub.email}</td>
                    <td>${sub.timestamp}</td>
                </tr>
            `).join('');
        }
    }

    // Fill Contact Submissions Table
    if (submissionsTableBody) {
        const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        if (submissions.length === 0) {
            submissionsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No contact requests recorded yet.</td></tr>`;
        } else {
            submissionsTableBody.innerHTML = submissions.map(sub => `
                <tr>
                    <td>${sub.name}</td>
                    <td>${sub.email}</td>
                    <td>${sub.phone}</td>
                    <td>${sub.message}</td>
                    <td>${sub.timestamp}</td>
                </tr>
            `).join('');
        }
    }

    // Helper to generate and download CSV file
    function exportToCsv(filename, headers, rows) {
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Export Subscribers
    const exportSubscribersBtn = document.getElementById('exportSubscribers');
    if (exportSubscribersBtn) {
        exportSubscribersBtn.addEventListener('click', () => {
            const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            if (subscribers.length === 0) {
                alert('No data available to export.');
                return;
            }
            const headers = ['Email Address', 'Timestamp Registered'];
            const rows = subscribers.map(sub => [sub.email, sub.timestamp]);
            exportToCsv('editkaro_subscribers.csv', headers, rows);
        });
    }

    // Export Contact Submissions
    const exportSubmissionsBtn = document.getElementById('exportSubmissions');
    if (exportSubmissionsBtn) {
        exportSubmissionsBtn.addEventListener('click', () => {
            const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
            if (submissions.length === 0) {
                alert('No data available to export.');
                return;
            }
            const headers = ['Name', 'Email Address', 'Phone Number', 'Message', 'Submission Timestamp'];
            const rows = submissions.map(sub => [sub.name, sub.email, sub.phone, sub.message, sub.timestamp]);
            exportToCsv('editkaro_contact_submissions.csv', headers, rows);
        });
    }

});
