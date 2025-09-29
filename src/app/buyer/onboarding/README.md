# Buyer Onboarding Flow

A comprehensive multi-step onboarding experience for new Procur buyers that feels editorial, image-forward, and approachable.

## Overview

The buyer onboarding flow guides new users through:

1. **Welcome** - Brand introduction and value proposition
2. **Profile Setup** - Business information and preferences
3. **Marketplace Tour** - Interactive marketplace preview
4. **First Actions** - Quick value-driven actions
5. **Wrap Up** - Completion celebration and next steps

## Features

### Design Principles

- **Editorial Layout**: Clean, magazine-style layouts with generous whitespace
- **Image-Forward**: Human-centered imagery of farms, products, and people
- **Approachable**: Calm, visually-driven experience building trust
- **Minimal Chrome**: No heavy shadows or dense UI panels

### User Experience

- **Progressive Disclosure**: Information revealed step-by-step
- **Personalization**: Tailored experience based on user inputs
- **Visual Feedback**: Clear progress indication and completion states
- **Flexible Navigation**: Users can go back and modify previous steps

### Technical Implementation

- **Responsive Design**: Optimized for mobile (320px+), tablet, and desktop
- **Accessibility**: WCAG AA+ compliance with keyboard navigation
- **Performance**: Optimized images and smooth transitions
- **Analytics**: Comprehensive telemetry tracking

## File Structure

```
/buyer/onboarding/
├── layout.tsx              # Onboarding-specific layout
├── page.tsx                # Main orchestrator component
├── onboarding.css          # Custom styles and animations
├── components/
│   ├── ProgressIndicator.tsx    # Step progress component
│   ├── WelcomeStep.tsx         # Step 1: Welcome
│   ├── ProfileSetupStep.tsx    # Step 2: Profile setup
│   ├── MarketplaceTourStep.tsx # Step 3: Marketplace tour
│   ├── FirstActionsStep.tsx    # Step 4: First actions
│   └── WrapUpStep.tsx          # Step 5: Completion
└── README.md               # This file
```

## Step Details

### 1. Welcome Step

- **Purpose**: Brand introduction and value proposition
- **Content**: Hero imagery, trust indicators, primary CTA
- **Layout**: Full-width hero with centered content
- **Key Features**:
  - Animated statistics overlay
  - Trust indicators (farms, countries, uptime)
  - Dual CTAs (Get Started / Learn More)

### 2. Profile Setup Step

- **Purpose**: Collect business information and preferences
- **Content**: Form fields with visual product category selection
- **Layout**: Two-column with form on left, guidance on right
- **Key Features**:
  - Business type selection with icons
  - Multi-select product categories
  - Real-time validation
  - Visual category previews

### 3. Marketplace Tour Step

- **Purpose**: Interactive marketplace preview
- **Content**: Search interface, filters, sample results
- **Layout**: Split-screen with search left, imagery right
- **Key Features**:
  - Dynamic search with live filtering
  - List/Map view toggle
  - Featured farms display
  - Marketplace statistics

### 4. First Actions Step

- **Purpose**: Quick value-driven actions to get started
- **Content**: Three action cards with clear benefits
- **Layout**: 3-up card grid with hover effects
- **Key Features**:
  - Selectable action cards
  - Progress tracking
  - Skip option available
  - Visual completion states

### 5. Wrap Up Step

- **Purpose**: Celebration and next steps guidance
- **Content**: Success message, profile summary, action callouts
- **Layout**: Two-column with celebration left, actions right
- **Key Features**:
  - Confetti animation
  - Personalized summary
  - Multiple next step options
  - Dashboard redirect

## Responsive Breakpoints

- **Mobile**: 320px - 768px (single column, stacked layout)
- **Tablet**: 769px - 1024px (two-column where appropriate)
- **Desktop**: 1025px+ (full two-column layout)
- **Large Desktop**: 1440px+ (increased spacing and max-width)

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and skip links
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion setting
- **Color Contrast**: AA+ compliance for all text

## Analytics & Telemetry

### Tracked Events

- `onboarding_step_complete`: When user completes each step
- `first_action_taken`: When user selects an action in step 4
- `onboarding_abandoned`: When user leaves before completion
- `onboarding_complete`: When full flow is finished

### Success Metrics

- Completion rate target: 80%+
- First product search within 5 minutes of completion
- Reduced abandonment after step 2

## Customization

### Brand Tokens

The design uses CSS custom properties for easy theming:

- `--primary-background`: Main background color
- `--secondary-black`: Primary text color
- `--secondary-muted-edge`: Secondary text color
- `--primary-accent2`: Primary accent color
- `--secondary-soft-highlight`: Border and highlight color

### Content Customization

- Step titles and descriptions can be easily modified
- Product categories and business types are configurable
- Trust indicators and statistics can be updated
- CTA text and actions are customizable

## Performance Considerations

- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Each step component is lazy-loadable
- **Animations**: CSS-based animations with reduced motion support
- **Bundle Size**: Minimal dependencies, custom CSS over heavy libraries

## Future Enhancements

- **Multi-language Support**: i18n integration ready
- **A/B Testing**: Component structure supports easy testing
- **Advanced Analytics**: Heat mapping and user session recording
- **Progressive Web App**: Offline support for partial completion
- **Integration**: API connections for real data

## Usage

To navigate to the onboarding flow:

```
/buyer/onboarding
```

The flow automatically redirects to `/buyer/dashboard` upon completion.

## Development

To modify the onboarding flow:

1. **Add new steps**: Create component in `/components/` and add to main page
2. **Modify styling**: Update `onboarding.css` or component-specific styles
3. **Change flow logic**: Modify the step navigation in `page.tsx`
4. **Update analytics**: Add new events in the telemetry tracking

## Testing

- **Responsive**: Test across all breakpoints (320px - 1440px+)
- **Accessibility**: Use screen reader and keyboard-only navigation
- **Performance**: Check Core Web Vitals and loading times
- **Cross-browser**: Test in Chrome, Firefox, Safari, Edge
- **Mobile**: Test on actual devices for touch interactions
