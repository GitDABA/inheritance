// Minimalist handler for Next.js on Netlify
// Optimized for size - only includes essential code

// eslint-disable-next-line no-undef
exports.handler = async function(event, context) {
  try {
    // Dynamic import to reduce bundle size
    const { createServerHandler } = await import('@netlify/next');
    
    // Create a handler with minimal options
    const handler = createServerHandler({
      event,
      context
    });
    
    // Execute handler
    return await handler();
  } catch (error) {
    console.error('Next.js error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `<html><body><h1>Server Error</h1><p>${error.message}</p></body></html>`
    };
  }
};
