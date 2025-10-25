# LandMap Component

Interactive map visualization for displaying vendor locations with utilization metrics.

## Usage

```tsx
import LandMap from "@/components/maps/LandMap";

<LandMap
  vendors={vendorLocations}
  onVendorClick={(vendorId) => router.push(`/vendors/${vendorId}`)}
/>;
```

## Props

| Prop            | Type                         | Required | Description                     |
| --------------- | ---------------------------- | -------- | ------------------------------- |
| `vendors`       | `VendorLocation[]`           | Yes      | Array of vendor location data   |
| `onVendorClick` | `(vendorId: string) => void` | No       | Callback when marker is clicked |

## VendorLocation Type

```typescript
interface VendorLocation {
  vendorId: string; // Unique vendor ID
  vendor: string; // Vendor name
  region: string; // Region/location name
  gps: {
    lat: number; // Latitude
    lng: number; // Longitude
  };
  total_acreage: number; // Total land area
  utilized_acreage: number; // Used land area
  available_acreage: number; // Available land area
  utilization_rate: number; // Percentage (0-100)
  crops: string[]; // Array of crop names
}
```

## Features

### Marker Colors

- 🟢 **Green**: 80%+ utilization (high productivity)
- 🟠 **Orange**: 60-79% utilization (medium)
- 🔴 **Red**: <60% utilization (low - needs attention)

### Interactive Elements

- Click markers to view detailed popup
- Click popup to navigate to vendor page
- Zoom and pan controls
- Legend showing color key
- Vendor count badge

### Popup Information

Each marker popup displays:

- Vendor name and region
- Total vs utilized acreage
- Utilization progress bar
- First 3 crops (with +N more indicator)

## Example

```tsx
const vendors = [
  {
    vendorId: "1",
    vendor: "Green Valley Farms",
    region: "St. George's",
    gps: { lat: 12.0561, lng: -61.7516 },
    total_acreage: 250,
    utilized_acreage: 180,
    available_acreage: 70,
    utilization_rate: 72,
    crops: ["Tomatoes", "Lettuce", "Peppers"],
  },
];

<LandMap
  vendors={vendors}
  onVendorClick={(id) => console.log("Clicked:", id)}
/>;
```

## Notes

- Automatically filters vendors without valid GPS coordinates
- Centers on Grenada by default (12.1165°N, 61.679°W)
- Auto-fits bounds to show all markers
- Uses OpenStreetMap tiles
- Responsive and mobile-friendly
