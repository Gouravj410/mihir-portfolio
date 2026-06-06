document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Offset for the fixed header (90px)
                const headerOffset = 90;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve if you want it to fade in only once
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove visible class if you want it to fade out when scrolling away
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Handle initial visible elements (like hero section)
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('visible');
        }
    }, 100);

    // Hero video fade transition on loop
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('ended', () => {
            heroVideo.classList.add('fade-out');
            setTimeout(() => {
                heroVideo.currentTime = 0;
                // Wait an additional 800ms while hidden for a small pause
                setTimeout(() => {
                    heroVideo.play().catch(e => console.log('Video play interrupted:', e));
                    heroVideo.classList.remove('fade-out');
                }, 800);
            }, 600); // Wait for the 0.6s fade-out transition to complete
        });
    }

    // Modal Logic for Portfolios
    const modal = document.getElementById('pdfModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIframe = document.getElementById('modalIframe');
    const modalDownload = document.getElementById('modalDownload');
    const modalClose = document.getElementById('modalClose');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const pdfName = card.getAttribute('data-pdf');
            const pdfSrc = card.getAttribute('data-src');

            modalTitle.textContent = pdfName + " Portfolio";
            // Use #toolbar=0 to disable default PDF viewer toolbar if desired, 
            // though some browsers ignore it.
            if (pdfSrc.includes('drive.google.com') && pdfSrc.includes('/view')) {
                modalIframe.src = pdfSrc.replace('/view?usp=drive_link', '/preview').replace('/view', '/preview');
            } else {
                modalIframe.src = pdfSrc + "#toolbar=0&navpanes=0&scrollbar=0";
            }
            modalDownload.href = pdfSrc;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling in background
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear iframe src to stop loading if it was still loading
        setTimeout(() => {
            modalIframe.src = "";
        }, 500);
    };

    modalClose.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
