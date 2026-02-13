import '../scss/main.scss';

document.addEventListener('DOMContentLoaded', () => {
    renderCheckout();
    setupEventListeners();
});

function renderCheckout() {
    // Check for "Buy Now" item first (temporary item)
    const buyNowItem = JSON.parse(sessionStorage.getItem('amazon_buy_now'));
    let items = [];

    if (buyNowItem) {
        items = [buyNowItem];
    } else {
        // Fallback to regular cart
        items = JSON.parse(localStorage.getItem('amazon_cart') || '[]');
    }

    const itemsContainer = document.getElementById('checkout-items-list');
    const summaryItemsPrice = document.getElementById('summary-items-price');
    const summaryTotalPrice = document.getElementById('summary-total-price');

    if (items.length === 0) {
        itemsContainer.innerHTML = '<div class="alert alert-info">Your cart is empty. <a href="products.html">Continue shopping</a>.</div>';
        return;
    }

    itemsContainer.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        const priceStr = (item.price || '0').toString();
        const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
        const subtotal = priceNum * (item.quantity || 1);
        total += subtotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'd-flex gap-3 mb-4';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.title}" width="100" class="object-fit-contain rounded border">
            <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">${item.title}</h6>
                <div class="text-danger fw-bold">₹${subtotal.toLocaleString('en-IN')}</div>
                <div class="small">Qty: ${item.quantity || 1}</div>
                <div class="small text-success mt-1 fw-bold">Eligible for FREE Shipping</div>
            </div>
        `;
        itemsContainer.appendChild(itemEl);
    });

    const formattedTotal = '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    summaryItemsPrice.textContent = formattedTotal;
    summaryTotalPrice.textContent = formattedTotal;
}

function setupEventListeners() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            // Success animation or message
            alert('Order placed successfully! Thank you for shopping with Amazon Clone.');

            // Clear temporary buy now or cart
            if (sessionStorage.getItem('amazon_buy_now')) {
                sessionStorage.removeItem('amazon_buy_now');
            } else {
                localStorage.removeItem('amazon_cart');
            }

            // Redirect to orders or home
            window.location.href = 'orders.html';
        });
    }
}
