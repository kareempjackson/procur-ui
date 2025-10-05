# ProcurLoader Component

A custom loading component featuring the Procur logo with a smooth filling animation effect. **Always displays as a full-screen overlay** that covers the entire viewport.

## Features

- **Full-Screen Overlay**: Always covers the entire screen with a colored background
- **Animated Logo**: The Procur logo fills up from bottom to top in a continuous loop
- **Multiple Sizes**: Small, medium, and large size options
- **Optional Text**: Display loading text below the logo
- **Brand Consistent**: Uses the official Procur logo in black
- **Blocks Interaction**: Prevents user interaction while loading

## Usage

```tsx
import ProcurLoader from '@/components/ProcurLoader';

// Show loader (always fullscreen)
<ProcurLoader size="lg" text="Loading..." />

// Different sizes
<ProcurLoader size="sm" text="Loading..." />
<ProcurLoader size="md" text="Loading products..." />

// Without text
<ProcurLoader size="lg" />
```

## Props

| Prop         | Type                   | Default     | Description                               |
| ------------ | ---------------------- | ----------- | ----------------------------------------- |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`      | Size of the loader                        |
| `text`       | `string`               | `undefined` | Optional text to display below the loader |
| `fullscreen` | `boolean`              | `true`      | Whether to display as full-screen overlay |
| `className`  | `string`               | `''`        | Additional CSS classes for the wrapper    |

## Size Reference

- **Small (`sm`)**: 80px (5rem) - Good for inline loading states
- **Medium (`md`)**: 128px (8rem) - Good for content sections and page overlays
- **Large (`lg`)**: 160px (10rem) - Good for full-page loading states

## Examples

### Conditional Loading

```tsx
// Shows a full-screen overlay when loading
{
  isLoading && <ProcurLoader size="lg" text="Loading..." />;
}
```

### Page Component Loading

```tsx
// Use as a return statement in page components
if (loading) {
  return <ProcurLoader size="lg" text="Loading page..." />;
}
```

### Section Loading

```tsx
// For loading specific sections (still covers entire screen)
{
  loading ? (
    <ProcurLoader size="md" text="Loading products..." />
  ) : (
    <ProductList />
  );
}
```

### Different Messages

```tsx
// Customize loading message for different contexts
<ProcurLoader size="lg" text="Loading your orders..." />
<ProcurLoader size="lg" text="Processing payment..." />
<ProcurLoader size="lg" text="Saving changes..." />
```

## Animation Details

The loader uses a CSS animation that creates a "filling" effect:

- The animation runs continuously in a 2-second loop
- The logo fills from bottom to top over 1 second
- It stays filled for a brief moment before resetting
- The background shows a faint version of the logo for context

## Demo

Visit `/loader-demo` to see all variations of the ProcurLoader in action.
