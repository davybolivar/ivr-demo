const path = require('path');

// craco.config.js
module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    webpack: {
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    },
    jest: {
      configure: {
        moduleNameMapper: {
          '^@(.*)$': '<rootDir>/src$1'
        }
      }
    },
  }