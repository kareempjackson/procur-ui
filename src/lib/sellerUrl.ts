export function createCountrySlug(location?: string | null): string {
  if (!location) return "caribbean";
  return location
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export type SellerLinkInput = {
  id: string;
  slug?: string | null;
  location?: string | null;
};

export function buildSellerUrl(seller: SellerLinkInput): string {
  if (!seller.slug) return `/sellers/${seller.id}`;
  return `/sellers/${createCountrySlug(seller.location)}/${seller.slug}`;
}
