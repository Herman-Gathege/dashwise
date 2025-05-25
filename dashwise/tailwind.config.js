// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // this includes all your component files
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // include Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // include Flowbite plugin
  ],
};
