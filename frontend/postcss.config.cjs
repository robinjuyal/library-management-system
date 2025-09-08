module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // ✅ updated line
    require('autoprefixer'),
  ],
}
