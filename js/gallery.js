// Gallery page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Gallery filter functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryCount = document.querySelector('.gallery-count');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            let visibleCount = 0;
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                    visibleCount++;
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Update count
            updateGalleryCount(visibleCount);
        });
    });

    // Gallery item click for lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            const date = this.querySelector('.gallery-date').textContent;
            
            createLightbox(imgSrc, title, description, date);
        });
    });

    // Create lightbox
    function createLightbox(imgSrc, title, description, date) {
        // Remove existing lightbox if any
        const existingLightbox = document.querySelector('.lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${imgSrc}" alt="${title}">
                <div class="lightbox-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="lightbox-date">${date}</div>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);

        // Show lightbox with animation
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);

        // Close lightbox functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        }
    }

    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentlyShown = 18;
    const totalItems = galleryItems.length;

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const hiddenItems = Array.from(galleryItems).slice(currentlyShown, currentlyShown + 6);
            
            hiddenItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                }, index * 100);
            });

            currentlyShown += hiddenItems.length;
            updateGalleryCount(currentlyShown);

            if (currentlyShown >= totalItems) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // Update gallery count
    function updateGalleryCount(visibleCount) {
        if (galleryCount) {
            galleryCount.textContent = `18 fotoğraftan ${visibleCount}'si gösteriliyor`;
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.includes('#') && !href.startsWith('index.html#')) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Parallax effect for gallery hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const galleryHero = document.querySelector('.gallery-hero');
        
        if (galleryHero) {
            galleryHero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Initialize gallery count
    updateGalleryCount(galleryItems.length);

    // Add loading animation for images
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        img.addEventListener('load', function() {
            item.classList.add('loaded');
        });

        // Handle broken images
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23333"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%23666" font-family="Arial" font-size="16"%3EFotoğraf Yüklenemedi%3C/text%3E%3C/svg%3E';
        });
    });
});
