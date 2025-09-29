import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";

interface PostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: PostPageProps) {
  const { slug } = params;
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />
      <article className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">
          Procur Blog
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[var(--secondary-black)] break-words">
          {slug.replace(/-/g, " ")}
        </h1>
        <div className="mt-6 prose prose-neutral max-w-none">
          <p>
            This is a placeholder post. Connect your CMS or markdown files to
            populate content for <strong>/{slug}</strong>.
          </p>
          <p>
            You can extend this page to fetch post data by slug and render hero
            images, metadata, authors, and related posts.
          </p>
        </div>
      </article>
      <Footer />
    </div>
  );
}
