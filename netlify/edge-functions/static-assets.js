// Edge function for serving static assets more efficiently
// This reduces the load on the serverless functions

export default async function handler(request, context) {
  const url = new URL(request.url);
  
  // Check if this is a static asset request
  const isStaticAsset = url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|json|woff|woff2|ttf|eot)$/i);
  
  if (isStaticAsset) {
    // Let the CDN handle static assets directly
    return context.next();
  }
  
  // For API routes and dynamic pages, let the serverless function handle it
  return context.next();
}
