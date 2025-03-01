// A simplified proxy handler that avoids ES Module issues
// This is based on Netlify examples for dealing with ESM compatibility issues

// eslint-disable-next-line no-undef
exports.handler = async function(event, context) {
  try {
    // Import the Next.js handler dynamically
    const { createServerHandler } = await import('@netlify/next');
    
    // Create a handler specifically for the Next.js version
    const handler = createServerHandler({
      // Pass the event and context to the handler
      event,
      context,
      
      // Provide essential site configuration
      buildDir: ".next",
      distDir: ".next",
      
      // Set Netlify-specific options
      setAssetHeaders: true,
      useServerBuild: true
    });
    
    // Execute the handler and return its response
    return await handler();
  } catch (error) {
    console.error('Error in Next.js server handler:', error);
    
    // Return a helpful error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <head>
            <title>Server Error</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
              pre { background: #f0f0f0; padding: 1rem; border-radius: 4px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>Server Error</h1>
            <p>The application encountered an unexpected error.</p>
            <h2>Error Details:</h2>
            <pre>${error.message}\n\n${error.stack || 'No stack trace available'}</pre>
          </body>
        </html>
      `
    };
  }
};
