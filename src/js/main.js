import '../scss/main.scss'
import '../scss/orders.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import * as bootstrap from 'bootstrap'

console.log('Amazon Clone Initialized')

// Example: Add search functionality or card hover effects
document.querySelector('.nav-search button')?.addEventListener('click', () => {
    const query = document.querySelector('.nav-search input').value
    alert(`Searching for: ${query}`)
})

// Back to top functionality
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Geolocation for "Select your address"
const addressLine2 = document.querySelector('.nav-address .line-2');

if (addressLine2) {
    const setAddress = (country) => {
        if (country) {
            addressLine2.textContent = country;
            // Store in session to avoid repeated calls
            sessionStorage.setItem('userCountry', country);
        }
    };

    // Check session storage first
    const savedCountry = sessionStorage.getItem('userCountry');
    if (savedCountry) {
        setAddress(savedCountry);
    } else {
        // Primary: IP-based location (fast, no prompt)
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country_name) {
                    setAddress(data.country_name);
                } else {
                    throw new Error('Country not found in IP data');
                }
            })
            .catch(() => {
                // Fallback 1: Browser Geolocation (requires prompt)
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                            .then(res => res.json())
                            .then(data => {
                                if (data.address && data.address.country) {
                                    setAddress(data.address.country);
                                }
                            });
                    }, () => {
                        // Fallback 2: Timezone inference
                        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                        if (tz.includes('Calcutta') || tz.includes('India')) {
                            setAddress('India');
                        } else {
                            setAddress('Select your address');
                        }
                    });
                } else {
                    // Final Fallback: Timezone inference
                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    if (tz.includes('Calcutta') || tz.includes('India')) {
                        setAddress('India');
                    }
                }
            });
    }
}
// Language Selector with Google Translate Integration
// Universal Language Selector (Header & Footer)
const langItems = document.querySelectorAll('.dropdown-item[data-lang]');
const navbarFlag = document.querySelector('#currentFlag');
const navbarLangText = document.querySelector('#currentLang');
const footerLangText = document.querySelector('#footerLangText');

if (langItems) {
    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = item.getAttribute('data-lang');
            const flag = item.getAttribute('data-flag');
            const langName = item.textContent.trim().split('-')[0].trim();

            // Update Navbar UI
            if (navbarFlag && navbarLangText) {
                navbarFlag.src = flag;
                navbarLangText.textContent = lang;
            }

            // Update Footer UI
            if (footerLangText) {
                footerLangText.textContent = langName;
            }

            // Trigger Google Translate
            const googleCombo = document.querySelector('.goog-te-combo');
            if (googleCombo) {
                googleCombo.value = lang.toLowerCase();
                googleCombo.dispatchEvent(new Event('change'));
            }
        });
    });
}

// Google Translate Initialization
window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
        { pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false },
        'google_translate_element'
    );
};

// Load Google Translate Script
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(script);

// Observer to hide Google Translate Banner and reset body top
const observer = new MutationObserver(() => {
    const body = document.body;
    const html = document.documentElement;
    const bannerFrame = document.querySelector('.goog-te-banner-frame');

    if (body.style.top !== '0px' && body.style.top !== '') {
        body.style.top = '0px';
    }

    if (html.style.top !== '0px' && html.style.top !== '') {
        html.style.top = '0px';
    }

    if (bannerFrame) {
        bannerFrame.style.display = 'none';
        bannerFrame.style.visibility = 'hidden';
    }
});

observer.observe(document.body, { attributes: true, attributeFilter: ['style'], childList: true });
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

// Search Scope Functionality
document.querySelectorAll('.nav-search-scope .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const scopeText = e.target.textContent;
        const scopeSpan = e.target.closest('.nav-search-scope').querySelector('span');
        if (scopeSpan) {
            scopeSpan.textContent = scopeText;
        }
    });
});

// Sidebar Functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebarAll = document.querySelector('.subnav-all');
    const amazonSidebar = document.querySelector('#amazonSidebar');
    const sidebarOverlay = document.querySelector('#sidebarOverlay');
    const closeSidebar = document.querySelector('#closeSidebar');

    if (sidebarAll && amazonSidebar && sidebarOverlay && closeSidebar) {
        const toggleSidebar = (show) => {
            if (show) {
                amazonSidebar.classList.add('active');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                amazonSidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        };

        sidebarAll.addEventListener('click', () => toggleSidebar(true));
        closeSidebar.addEventListener('click', () => toggleSidebar(false));
        sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

        // Sidebar See All Toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.see-all-toggle')) {
                const toggleBtn = e.target.closest('.see-all-toggle');
                const section = toggleBtn.closest('.sidebar-section');
                const extraContent = section.querySelector('.extra-categories');

                if (extraContent) {
                    const isHidden = extraContent.classList.contains('d-none');
                    if (isHidden) {
                        extraContent.classList.remove('d-none');
                        toggleBtn.innerHTML = 'See less <i class="bi bi-chevron-up ms-1"></i>';
                    } else {
                        extraContent.classList.add('d-none');
                        toggleBtn.innerHTML = 'See all <i class="bi bi-chevron-down ms-1"></i>';
                    }
                }
            }
        });
    }

    // Auth UI Updates
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser) {
        const navAccountName = document.querySelector('.nav-account .line-1');
        if (navAccountName) {
            navAccountName.textContent = `Hello, ${currentUser.name.split(' ')[0]}`;
        }

        const sidebarHeader = document.querySelector('#amazonSidebar .sidebar-header');
        const sidebarHeaderName = sidebarHeader?.querySelector('h5');
        if (sidebarHeaderName) {
            sidebarHeaderName.textContent = `Hello, ${currentUser.name.split(' ')[0]}`;
        }
        if (sidebarHeader) {
            sidebarHeader.href = 'orders.html';
        }

        const navOrdersLink = document.querySelector('.nav-orders a');
        if (navOrdersLink) {
            navOrdersLink.href = 'orders.html';
        }

        const signInPrompt = document.getElementById('signInPrompt');
        if (signInPrompt) {
            signInPrompt.innerHTML = `
                <div class="text-start px-3">
                    <h6 class="fw-bold mb-1">Your Account</h6>
                    <a href="#" id="signOutBtn" class="text-danger small text-decoration-none">Sign Out</a>
                </div>
            `;

            document.getElementById('signOutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('current_user');
                window.location.reload();
            });
        }
    }

    // Cart Management Logic
    const initCart = () => {
        const cart = JSON.parse(localStorage.getItem('amazon_cart') || '[]');
        updateCartCount(cart);
    };

    const updateCartCount = (cart) => {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElements.forEach(el => {
            el.textContent = count;
        });
    };

    window.addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('amazon_cart') || '[]');
        const existingItem = cart.find(item => item.title === product.title);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('amazon_cart', JSON.stringify(cart));
        updateCartCount(cart);

        // Visual feedback
        const cartIcon = document.querySelector('.nav-cart');
        if (cartIcon) {
            cartIcon.classList.add('cart-animate');
            setTimeout(() => cartIcon.classList.remove('cart-animate'), 500);
        }
    };

    initCart();
});
