export default function Head() {
  const title = "Seller Overview · Procur";
  const description =
    "Single-pane overview of inventory, orders, and performance analytics for sellers on Procur.";
  const url = "/seller";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="robots" content="index,follow" />
    </>
  );
}
