import '../scss/product_details.scss';
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const params = new URLSearchParams(window.location.search);
    let productId = params.get('id');

    // Default to iPhone if no ID or invalid ID
    if (!productId || !document.getElementById(`template-${productId}`)) {
        productId = 'iphone-15-pro-renewed';
    }

    // Get container and template
    const container = document.getElementById('product-details-container');
    const template = document.getElementById(`template-${productId}`);

    if (container && template) {
        // Clone content
        container.innerHTML = template.innerHTML;

        // Update Title
        const h1 = container.querySelector('h1');
        if (h1) document.title = h1.innerText;

        // Setup Gallery Logic (Needs to be re-attached after injection)
        setupGallery(container);
        setupColorVariants(container);
        setupSelectionGroups(container);
        setupAddToCart(container);
        setupBuyNow(container);
        setupDeliveryDates(container);
    }
});

function setupDeliveryDates(container) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getFormattedDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);

        if (daysToAdd === 1) {
            return `Tomorrow, ${date.getDate()} ${months[date.getMonth()]}`;
        }
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    };

    // Update placeholders if they exist
    const fastDateEl = container.querySelector('.delivery-date-fast');
    const standardDateEl = container.querySelector('.delivery-date-standard');
    const countdownEl = container.querySelector('.countdown');

    // Logic: Prime usually gets 'Tomorrow', Non-Prime gets 4-10 range.
    // We can check if the title contains high-end tech or if it's explicitly marked.
    // For now, let's use a consistent 4-10 range for standard as requested.
    // 'Fastest' can be 1-2 days (Prime-like) or 2-4 days.

    // Randomize slightly based on current hour to stay within 4-10 range
    const standardDays = 4 + (new Date().getHours() % 6); // 4 to 10 days
    const fastDays = 1; // Tomorrow

    if (fastDateEl) fastDateEl.innerText = getFormattedDate(fastDays);
    if (standardDateEl) standardDateEl.innerText = getFormattedDate(standardDays);

    // Dynamic Countdown
    if (countdownEl) {
        const now = new Date();
        const hrs = 23 - now.getHours();
        const mins = 59 - now.getMinutes();
        countdownEl.innerText = `${hrs} hrs ${mins} mins`;
    }
}

function setupBuyNow(container) {
    const buyNowBtn = container.querySelector('.btn-buy-now') ||
        container.querySelector('.btn-orange') ||
        container.querySelectorAll('.btn-warning')[1]; // Second btn-warning is usually Buy Now

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = getProductData(container);

            // Store in sessionStorage for single-item checkout
            sessionStorage.setItem('amazon_buy_now', JSON.stringify(product));
            window.location.href = 'checkout.html';
        });
    }
}

function setupAddToCart(container) {
    const addBtn = container.querySelector('.btn-warning.w-100.rounded-pill') ||
        container.querySelector('.btn-add-cart') ||
        container.querySelectorAll('.btn-warning')[0];
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = getProductData(container);

            if (window.addToCart) {
                window.addToCart({
                    ...product,
                    prime: true
                });
            }
        });
    }
}

function getProductData(container) {
    const title = container.querySelector('h1')?.innerText;
    // Try multiple selectors for price
    const price = container.querySelector('.price-main .price-value')?.innerText ||
        container.querySelector('.price-block .fs-4')?.innerText ||
        container.querySelector('.current-price')?.innerText ||
        container.querySelector('.buy-box-price')?.innerText ||
        container.querySelector('.price-section .fs-2')?.innerText ||
        container.querySelector('.price-section .fs-1')?.innerText ||
        '0';
    const img = container.querySelector('.main-image img')?.src;

    return {
        title: title,
        price: price,
        img: img,
        quantity: 1
    };
}

function setupSelectionGroups(container) {
    const groups = container.querySelectorAll('.selection-group, .size-variation, .variation-selectors > div, .variation-selectors .mb-3');

    groups.forEach(group => {
        const label = group.querySelector('.selection-label span, .small.fw-bold span, .fw-normal');
        const options = group.querySelectorAll('.option-item, .btn-outline-secondary, .d-flex.gap-2 > div:not(.small)');

        if (options.length === 0) return;

        options.forEach(option => {
            const updateSelection = () => {
                options.forEach(o => o.classList.remove('active', 'selected', 'border-primary', 'bg-light', 'fw-bold'));
                option.classList.add('active');
                if (label) {
                    // Get text from children to avoid mixing label text
                    const mainText = option.querySelector('.fw-bold, strong, .option-text, .variant-text, .xsmall')?.innerText || option.innerText.split('\n')[0];
                    label.innerText = mainText.trim();
                }
            };

            option.addEventListener('click', updateSelection);
        });
    });
}

function setupColorVariants(container) {
    const colorLabel = container.querySelector('.color-label span, #selected-color, [class*="color-variation"] .fw-normal, .variations .fw-normal, .variation-selectors .fw-normal');
    const variantItems = container.querySelectorAll('.variant-item, .variation-item, .color-variation .d-flex > div:not(.small), .variation-selectors .variation-item');

    if (variantItems.length === 0) return;

    variantItems.forEach(item => {
        const updateVariant = () => {
            // Remove active/selected classes
            variantItems.forEach(v => v.classList.remove('active', 'selected', 'border-primary'));
            // Add active
            item.classList.add('active');

            // Update label
            if (colorLabel) {
                const img = item.querySelector('img');
                const text = item.querySelector('.variant-text, .variation-text, .text-11, .xsmall');
                if (img && img.alt) {
                    colorLabel.innerText = img.alt;
                } else if (text) {
                    colorLabel.innerText = text.innerText;
                }
            }
        };

        item.addEventListener('mouseenter', updateVariant);
        item.addEventListener('click', updateVariant);
    });
}

function setupGallery(container) {
    const mainImage = container.querySelector('.main-image img');
    const thumbnails = container.querySelectorAll('.thumbnail');

    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach(thumb => {
        // Click and Hover logic
        const updateImage = () => {
            // Remove active class from all
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add to current
            thumb.classList.add('active');
            // Update main image
            const img = thumb.querySelector('img');
            if (img) mainImage.src = img.src;
        };

        thumb.addEventListener('mouseenter', updateImage);
        thumb.addEventListener('click', updateImage);
    });
}
