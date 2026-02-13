import '../scss/products.scss';
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'home';
    const grid = document.getElementById('product-grid');
    const title = document.getElementById('category-title');

    const formatTitle = (str) => {
        return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const categoryName = formatTitle(category);
    const displayTitle = category === 'led_tvs' ? 'Smart LED TVs' : categoryName;
    if (title) title.textContent = displayTitle;

    // Sidebar Filter Visibility
    const filterGroups = document.querySelectorAll('.filter-group');
    filterGroups.forEach(group => {
        const groupCat = group.getAttribute('data-filter-category');
        // Show group if it matches category, or show 'mobiles' if category is 'home'
        if (groupCat === category || (category === 'home' && groupCat === 'mobiles')) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });

    // Read Data from HTML Structure
    let productsData = {};
    const dataSource = document.getElementById('products-source');

    if (dataSource) {
        const categories = dataSource.querySelectorAll('.category-data');
        categories.forEach(cat => {
            const catName = cat.getAttribute('data-category');
            const items = [];
            const productArticles = cat.querySelectorAll('.product-item');

            productArticles.forEach(article => {
                const item = {};

                // Helper to get text content safely
                const getText = (selector) => {
                    const el = article.querySelector(selector);
                    return el ? el.textContent : null;
                };

                item.title = getText('.product-title');

                // Extract link from title if present
                const linkEl = article.querySelector('.product-title a');
                if (linkEl) {
                    item.link = linkEl.getAttribute('href');
                }

                const imgEl = article.querySelector('.product-img');
                if (imgEl) item.img = imgEl.src;

                item.price = getText('.product-price');
                item.original = getText('.product-original-price');
                item.reviews = getText('.product-reviews');
                item.badge = getText('.product-badge');
                item.bought = getText('.product-bought');

                // Parse numbers
                const ratingStr = getText('.product-rating');
                if (ratingStr) item.rating = parseFloat(ratingStr);

                // Parse booleans
                item.prime = !!article.querySelector('.product-prime');
                item.sponsored = !!article.querySelector('.product-sponsored');
                item.options = !!article.querySelector('.product-options');

                items.push(item);
            });

            productsData[catName] = items;
        });
    }
    let items = productsData[category];
    console.log(`Loading category: ${category}, Found ${items ? items.length : 0} items`);

    // Final fallback logic
    if (!items || items.length === 0) {
        items = Array.from({ length: 10 }, (_, i) => ({
            title: `Popular ${categoryName} Model ${i + 1} - Amazon Prime`,
            price: (Math.floor(Math.random() * 5000) + 1200).toLocaleString(),
            original: (Math.floor(Math.random() * 8000) + 7000).toLocaleString(),
            rating: 4.0 + (Math.random() * 0.9),
            reviews: (Math.floor(Math.random() * 10000) + 500).toLocaleString(),
            img: `https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SY200_.jpg`,
            prime: true,
            badge: i === 0 ? "Best Seller" : (i === 1 ? "Amazon's Choice" : ""),
            sponsored: i % 4 === 0,
            bought: (Math.floor(Math.random() * 5) + 5) + "K+ bought in past month"
        }));
    }

    if (grid) {
        grid.innerHTML = ''; // Clear spinner
        const template = document.getElementById('product-card-template');

        items.forEach(item => {
            const clone = template.content.cloneNode(true);

            // Set Image and Badge
            const img = clone.querySelector('.card-img-top');
            img.src = item.img;
            img.alt = item.title;

            const badge = clone.querySelector('.badge-overlay');
            if (item.badge) {
                badge.textContent = item.badge;
                if (item.badge.includes('Choice')) badge.classList.add('badge-choice');
            } else {
                badge.remove();
            }

            // Set Title
            const titleLink = clone.querySelector('.card-title a');
            titleLink.textContent = item.title;
            if (item.link) {
                titleLink.href = item.link;
                titleLink.removeAttribute('target'); // remove blank target for internal link
            }

            // Set Sponsored
            const sponsored = clone.querySelector('.sponsored-label');
            if (!item.sponsored) sponsored.remove();

            // Set Rating
            const starsContainer = clone.querySelector('.stars');
            const fullStars = Math.floor(item.rating);
            const hasHalfStar = item.rating % 1 !== 0;

            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                if (i < fullStars) {
                    star.className = 'bi bi-star-fill';
                } else if (i === fullStars && hasHalfStar) {
                    star.className = 'bi bi-star-half';
                } else {
                    star.className = 'bi bi-star';
                }
                starsContainer.appendChild(star);
            }

            clone.querySelector('.count').textContent = item.reviews;

            // Set Bought Count
            const bought = clone.querySelector('.bought-count');
            if (item.bought) {
                bought.textContent = item.bought;
            } else {
                bought.remove();
            }

            // Set Price
            clone.querySelector('.price-value').textContent = item.price;
            clone.querySelector('.old-price').textContent = `₹${item.original}`;

            // Set Prime
            const prime = clone.querySelector('.prime-icon');
            if (!item.prime) prime.remove();

            // Set Delivery Date
            const deliveryDateEl = clone.querySelector('.delivery-info .date');
            if (deliveryDateEl) {
                const getFormattedDeliveryDate = (daysToAdd) => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const date = new Date();
                    date.setDate(date.getDate() + daysToAdd);

                    if (daysToAdd === 1) {
                        return `Tomorrow, ${date.getDate()} ${months[date.getMonth()]}`;
                    }
                    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
                };

                // Logic: 1 day for Prime, 4-10 days for others as requested
                // We use a simple formula to stay within 4-10 roughly based on item index if available
                const standardDays = 4 + (Math.abs(item.title.length) % 7); // 4 to 10 days
                const deliveryDays = item.prime ? 1 : standardDays;
                deliveryDateEl.textContent = getFormattedDeliveryDate(deliveryDays);
            }

            // Set Buttons
            const addBtn = clone.querySelector('.btn-add-cart');
            const optionsBtn = clone.querySelector('.btn-see-options');

            if (item.options) {
                addBtn.classList.add('d-none');
                optionsBtn.classList.remove('d-none');
            } else {
                addBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.addToCart({
                        title: item.title,
                        price: item.price,
                        img: item.img,
                        prime: item.prime
                    });
                });
            }

            grid.appendChild(clone);
        });
    }
});
