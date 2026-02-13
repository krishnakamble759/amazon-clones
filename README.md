# Amazon Clone - Modern Multi-Page E-commerce Website

A premium, fully responsive Amazon clone built with modern web technologies. This project features a sophisticated Multi-Page Application (MPA) architecture, high-fidelity UI/UX, and a robust build system.

## 🚀 Key Features

- **Multi-Page Architecture**: Distinct pages for Home, Products, Product Details, Cart, Checkout, Orders, Sign In, and Registration.
- **Dynamic Product Details**: Interactive image galleries, color/size variation selectors, and real-time delivery countdowns.
- **Advanced State Management**: Persistent shopping cart and user authentication using LocalStorage.
- **Modern Styling**: Built with SCSS and Bootstrap 5, featuring a custom Amazon-themed color palette and fluid responsiveness.
- **Localization**: Integrated Google Translate support for multi-language accessibility.
- **Optimized Build**: Powered by Vite for lightning-fast development and optimized production bundles.

## 🛠️ Tech Stack

- **Frontend**: HTML5, SCSS (Sass), JavaScript (ES6+)
- **Frameworks**: Bootstrap 5, Bootstrap Icons
- **Build Tool**: Vite 7
- **Icons**: Bootstrap Icons

## 📦 Project Structure

```text
├── src/
│   ├── scs/          # Custom SCSS modules (main, product_details, variables, etc.)
│   └── js/           # Dynamic functionality (main.js, product_details.js, etc.)
├── public/           # Static assets (logos, product images, banners)
├── vite.config.js    # Multi-page Vite configuration
└── *.html           # Entry points for all application pages
```

## 🚥 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krishnakamble759/amazon-clones.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deployment

The project is configured for easy deployment on platforms like GitHub Pages, Vercel, or Netlify. The `vite.config.js` is set with a relative base path (`./`) to ensure all assets load correctly in subdirectories.

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## 📄 License

This project is open-source and available under the MIT License.
