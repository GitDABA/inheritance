// This is an alternative implementation that uses dynamic import
// to handle the ESM-CommonJS interop

// Define an async handler function
exports.handler = async function(event, context) {
  try {
    // Dynamically import the @netlify/plugin-nextjs package
    const { handler } = await import('@netlify/plugin-nextjs');
    
    // Call the handler with the event and context
    return await handler(event, context);
  } catch (error) {
    console.error('Error in Next.js handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
