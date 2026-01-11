export const ADMIN_CATALOG_PRODUCT_CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Herbs & Spices",
  "Grains & Cereals",
  "Dairy & Eggs",
  "Meat & Poultry",
  "Seafood",
  "Bakery",
  "Beverages",
  "Oils & Fats",
  "Condiments & Sauces",
  "Snacks",
  "Frozen Foods",
  "Canned Goods",
  "Other",
] as const;

export type AdminCatalogProductCategory =
  (typeof ADMIN_CATALOG_PRODUCT_CATEGORIES)[number];


