document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');

    // Mobile menu toggle
    if (menuToggle && desktopNav) {
        menuToggle.addEventListener('click', () => {
            desktopNav.classList.toggle('nav-open');
            menuToggle.setAttribute('aria-expanded', desktopNav.classList.contains('nav-open'));
        });

        // Close mobile nav when a link is clicked (for in-page anchors)
        desktopNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => desktopNav.classList.remove('nav-open'));
        });
    }

    // Smooth scroll with proper offset for navbar links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or opens modal
            if (href === '#' || this.getAttribute('onclick')) {
                return;
            }
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20; // 20px extra padding
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (desktopNav) {
                    desktopNav.classList.remove('nav-open');
                }
            }
        });
    });

    // Language Selector Functionality
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const langCurrent = document.querySelector('.lang-current');
    
    // Toggle dropdown
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
            langBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
            langBtn.classList.remove('active');
        });
        
        langDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Handle language selection
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = option.getAttribute('data-lang');
            const selectedText = option.textContent;
            
            // Update button text
            langCurrent.textContent = selectedText;
            
            // Remove active class from all options
            langOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Close dropdown
            langDropdown.classList.remove('show');
            langBtn.classList.remove('active');
            
            // Trigger translation using the global function
            if (typeof translateLanguage === 'function') {
                translateLanguage(selectedLang);
            } else {
                // Fallback method
                changeLanguage(selectedLang);
            }
        });
    });
    
    // Fallback function to change language
    function changeLanguage(lang) {
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkTranslate = setInterval(() => {
            attempts++;
            
            // Try multiple selectors
            let selectElement = document.querySelector('.goog-te-combo');
            
            if (!selectElement) {
                const selects = document.getElementsByTagName('select');
                for (let i = 0; i < selects.length; i++) {
                    if (selects[i].className.indexOf('goog-te-combo') !== -1) {
                        selectElement = selects[i];
                        break;
                    }
                }
            }
            
            if (selectElement) {
                clearInterval(checkTranslate);
                
                // Set the language
                selectElement.value = lang;
                
                // Trigger multiple events to ensure it works
                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                selectElement.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Also try triggering click
                if (selectElement.onchange) {
                    selectElement.onchange();
                }
                
                console.log('Language changed to:', lang);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkTranslate);
                console.error('Google Translate not loaded. Please refresh the page.');
                alert('Translation service is loading. Please try again in a moment.');
            }
        }, 100);
    }
    
    // Set initial active language
    const currentLangCode = getCookie('googtrans') || '/en/en';
    const activeLang = currentLangCode.split('/')[2] || 'en';
    
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === activeLang) {
            option.classList.add('active');
            langCurrent.textContent = option.textContent;
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('about-modal');
        if (modal && event.target === modal) {
            closeModal('about-modal');
        }
    });

    // Scroll reveal on load and scroll (throttled)
    checkVisibility();
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
        scrollTimeout = window.requestAnimationFrame(checkVisibility);
    }, { passive: true });
});

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function checkVisibility() {
    const revealedElements = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight;

    revealedElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 50);
});




