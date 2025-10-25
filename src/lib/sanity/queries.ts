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
  "author": author->{name, image}
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
};
