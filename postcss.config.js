module.exports = {
  plugins: {
    tailwindcss: {
      config: process.env.TAILWIND_CONFIG_PATH || './tailwind.config.js',
    },
    autoprefixer: {},
  },
}
