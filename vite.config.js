import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                products: resolve(__dirname, 'products.html'),
                product_details: resolve(__dirname, 'product_details.html'),
                cart: resolve(__dirname, 'cart.html'),
                checkout: resolve(__dirname, 'checkout.html'),
                orders: resolve(__dirname, 'orders.html'),
                register: resolve(__dirname, 'register.html'),
                signin: resolve(__dirname, 'signin.html'),
            },
        },
    },
});
