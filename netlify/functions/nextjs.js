// This file is needed for Netlify Next.js SSR functionality
// The @netlify/plugin-nextjs package will use this handler
// DO NOT MODIFY THIS FILE

// Use dynamic import for ES Module
import('@netlify/plugin-nextjs').then(mod => {
  module.exports = { handler: mod.handler };
});
