import '../scss/main.scss'
import './main.js'

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMsg = document.getElementById('empty-cart');
    const totalQtyElements = document.querySelectorAll('.total-qty');
    const totalPriceElements = document.querySelectorAll('.total-price');
    const checkoutCard = document.getElementById('checkout-card');

    const renderCart = () => {
        const cart = JSON.parse(localStorage.getItem('amazon_cart') || '[]');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCartMsg);
            checkoutCard?.classList.add('opacity-50');
            updateSummary(0, 0);
            return;
        }

        emptyCartMsg.remove();
        cartItemsContainer.innerHTML = '';

        let totalQty = 0;
        let totalPrice = 0;

        cart.forEach((item, index) => {
            // Robust parsing: remove all non-numeric characters except decimal point
            const priceStr = (item.price || '0').toString();
            const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
            totalQty += item.quantity;
            totalPrice += priceNum * item.quantity;

            const itemHtml = `
                <div class="cart-item row py-3 border-bottom g-3">
                    <div class="col-md-3">
                        <img src="${item.img}" alt="${item.title}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-7">
                        <h5 class="mb-1 fw-bold">${item.title}</h5>
                        <p class="text-success small mb-1">In stock</p>
                        <p class="small text-muted mb-2">Eligible for FREE Shipping</p>
                        <div class="d-flex align-items-center gap-3 qty-controls">
                            <select class="form-select form-select-sm border-secondary w-auto bg-light rounded-3" data-index="${index}">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'].map(num => `
                                    <option value="${num === '10+' ? 10 : num}" ${item.quantity === (num === '10+' ? 10 : num) ? 'selected' : ''}>Qty: ${num}</option>
                                `).join('')}
                            </select>
                            <span class="vr"></span>
                            <a href="#" class="small text-decoration-none delete-item" data-index="${index}">Delete</a>
                            <span class="vr"></span>
                            <a href="#" class="small text-decoration-none">Save for later</a>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <h5 class="fw-bold">₹${item.price}</h5>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        updateSummary(totalQty, totalPrice);
        attachListeners();
    };

    const updateSummary = (qty, price) => {
        totalQtyElements.forEach(el => el.textContent = qty);
        totalPriceElements.forEach(el => el.textContent = price.toLocaleString('en-IN'));
    };

    const attachListeners = () => {
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = btn.getAttribute('data-index');
                const cart = JSON.parse(localStorage.getItem('amazon_cart') || '[]');
                cart.splice(index, 1);
                localStorage.setItem('amazon_cart', JSON.stringify(cart));
                renderCart();
                // Trigger global count update
                const countUpdateEvent = new Event('storage');
                window.dispatchEvent(countUpdateEvent);
                window.location.reload(); // Quickest way to update main.js count
            });
        });

        document.querySelectorAll('select.form-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const index = select.getAttribute('data-index');
                const newQty = parseInt(e.target.value);
                const cart = JSON.parse(localStorage.getItem('amazon_cart') || '[]');
                cart[index].quantity = newQty;
                localStorage.setItem('amazon_cart', JSON.stringify(cart));
                renderCart();
                window.location.reload();
            });
        });
    };

    const setupCheckout = () => {
        const proceedBtn = document.querySelector('#checkout-card .btn-warning');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                const cart = JSON.parse(localStorage.getItem('amazon_cart') || '[]');
                if (cart.length > 0) {
                    sessionStorage.removeItem('amazon_buy_now'); // Use cart instead
                    window.location.href = 'checkout.html';
                }
            });
        }
    };

    renderCart();
    setupCheckout();
});
