import { groq } from "next-sanity";

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": categories[0]->title,
  publishedAt,
  mainImage,
  "imageAlt": coalesce(mainImage.alt, title)
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  body,
  publishedAt,
  mainImage,
  "imageAlt": coalesce(mainImage.alt, title),
  "category": categories[0]->title,
  "author": author->{name, image},
  excerpt,
  seoTitle,
  seoDescription,
  ogImage,
  noIndex
}`;

// Lightweight query for generateStaticParams + sitemap
export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}`;

export type SanityPostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  mainImage?: any;
  imageAlt?: string;
};

export type SanityPost = SanityPostListItem & {
  body?: any;
  author?: { name?: string; image?: any };
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: any;
  noIndex?: boolean;
};

export type SanityPostSlug = {
  slug: string;
  publishedAt?: string;
  _updatedAt?: string;
};
