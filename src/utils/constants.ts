import type { ContentType } from '../store/contentSlice';

export const CONTENT_TYPES: { value: ContentType; label: string; description: string }[] = [
  {
    value: 'blog_post_outline',
    label: 'Blog Post Outline',
    description: 'Create a structured outline for a blog post',
  },
  {
    value: 'product_description',
    label: 'Product Description',
    description: 'Generate compelling product descriptions',
  },
  {
    value: 'social_media_caption',
    label: 'Social Media Caption',
    description: 'Create engaging social media captions',
  },
  {
    value: 'article',
    label: 'Article',
    description: 'Generate full-length articles',
  },
  {
    value: 'email',
    label: 'Email',
    description: 'Create professional email content',
  },
];


