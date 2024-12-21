class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupPreloading();
    }

    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.dataset.src) {
                        entry.target.src = entry.target.dataset.src;
                        entry.target.removeAttribute('data-src');
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src], video[data-src]')
            .forEach(el => observer.observe(el));
    }

    setupImageOptimization() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                if (img.naturalWidth > 1200) {
                    console.warn('Image too large:', img.src);
                }
            });
        });
    }

    setupPreloading() {
        // Preload critical resources
        const preloadLinks = [
            '/fonts/inter.woff2',
            '/images/hero.webp'
        ];

        preloadLinks.forEach(link => {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = link;
            preload.as = link.includes('.woff2') ? 'font' : 'image';
            document.head.appendChild(preload);
        });
    }
} 