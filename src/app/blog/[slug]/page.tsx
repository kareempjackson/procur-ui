import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { postBySlugQuery, type SanityPost } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";

interface PostPageProps {
  params: { slug: string };
}

function formatDate(dateIso?: string) {
  if (!dateIso) return "";
  try {
    return new Date(dateIso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = await sanityClient.fetch<SanityPost>(postBySlugQuery, { slug });

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />
      <article className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">
          Procur Blog
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[var(--secondary-black)] break-words">
          {post?.title || slug.replace(/-/g, " ")}
        </h1>
        <div className="mt-3 text-gray-500 text-sm">
          {post?.category ? <span>{post.category}</span> : null}
          {post?.publishedAt ? (
            <span className="ml-2">{formatDate(post.publishedAt)}</span>
          ) : null}
        </div>

        {post?.mainImage ? (
          <div className="mt-6 relative h-72 w-full">
            <Image
              src={urlForImage(post.mainImage)
                .width(1600)
                .height(900)
                .fit("crop")
                .url()}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover rounded-xl border border-gray-200"
              priority
            />
          </div>
        ) : null}

        <div className="mt-8 prose prose-neutral max-w-none">
          {post?.body ? (
            <PortableText value={post.body} />
          ) : (
            <p>Post not found.</p>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
