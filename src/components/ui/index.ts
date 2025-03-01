// Export UI components with maximum compatibility
// To support both `import Button from '@/components/ui/Button'` 
// and `import { Button } from '@/components/ui'`
import Button, { buttonVariants } from './Button';
export { buttonVariants };
export { Button };
export { default as Input } from './Input';
export { default as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export { default as ImageUpload } from './ImageUpload';
