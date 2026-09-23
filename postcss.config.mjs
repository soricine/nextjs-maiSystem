// Tailwind CSS v4 runs as a PostCSS plugin. There is no `tailwind.config.js`
// in v4 — theme tokens live in CSS (see src/app/globals.css).
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
