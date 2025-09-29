# Seller Onboarding Flow

A comprehensive multi-step onboarding experience for new Procur sellers that matches the buyer onboarding aesthetic - editorial, image-forward, and approachable.

## Overview

The seller onboarding flow guides new farmers and suppliers through:

1. **Welcome** - Brand introduction and value proposition for sellers
2. **Profile Setup** - Farm details, certifications, and farming methods
3. **Products** - Product categories and seasonal availability
4. **Inventory** - Introduction to inventory management tools
5. **Payments** - Payment setup and payout configuration
6. **Wrap Up** - Completion celebration and next steps

## Features

### Design Principles

- **Editorial Layout**: Clean, magazine-style layouts matching buyer onboarding
- **Farm-Focused**: Imagery and content tailored to agricultural suppliers
- **Trust Building**: Emphasizes security, support, and seller success
- **Minimal Chrome**: Consistent with buyer aesthetic - no heavy shadows

### User Experience

- **Farm-Specific Flow**: Tailored questions about farming operations
- **Certification Tracking**: Support for organic, GAP, and other certifications
- **Seasonal Planning**: Helps sellers communicate availability patterns
- **Payment Security**: Emphasizes secure, fast payouts

### Technical Implementation

- **Shared Aesthetic**: Reuses buyer onboarding CSS and patterns
- **Seller-Specific Data**: Farm size, certifications, product categories
- **Payment Integration**: Payout schedules and secure account setup
- **Analytics Tracking**: Seller-specific telemetry events

## File Structure

```
/seller/onboarding/
├── layout.tsx                    # Seller onboarding layout
├── page.tsx                      # Main orchestrator component
├── seller-onboarding.css         # Seller-specific styles extending buyer CSS
├── components/
│   ├── SellerProgressIndicator.tsx    # Progress component
│   ├── SellerWelcomeStep.tsx         # Step 1: Welcome
│   ├── SellerProfileSetupStep.tsx    # Step 2: Farm profile
│   ├── SellerProductsStep.tsx        # Step 3: Product categories
│   ├── SellerInventoryStep.tsx       # Step 4: Inventory intro
│   ├── SellerPaymentsStep.tsx        # Step 5: Payment setup
│   └── SellerWrapUpStep.tsx          # Step 6: Completion
└── README.md                     # This file
```

## Step Details

### 1. Seller Welcome Step

- **Purpose**: Introduce Procur's value proposition for sellers
- **Content**: Farm-focused hero imagery, seller statistics, benefits
- **Layout**: Full-width hero with seller-specific trust indicators
- **Key Features**:
  - Seller-focused statistics (500+ sellers, $2M+ revenue)
  - Farm and agricultural imagery
  - Benefits: showcase farm, grow business, get paid fast

### 2. Seller Profile Setup Step

- **Purpose**: Collect farm and business information
- **Content**: Farm type, size, location, certifications, farming methods
- **Layout**: Two-column with form and preview
- **Key Features**:
  - Farm type selection (family, commercial, organic, cooperative)
  - Farm size categories with visual icons
  - Certification badges (organic, GAP, fair trade, etc.)
  - Farming method selection (conventional, organic, biodynamic, etc.)
  - Live profile preview

### 3. Seller Products Step

- **Purpose**: Define product categories and seasonal availability
- **Content**: Product category selection, seasonal calendar
- **Layout**: Two-column with categories and preview
- **Key Features**:
  - Visual product category cards with examples
  - Seasonal availability selector (spring, summer, fall, winter)
  - Product category preview with icons
  - Pro tips for sellers

### 4. Seller Inventory Step

- **Purpose**: Introduce inventory management features
- **Content**: Feature overview, mock inventory dashboard
- **Layout**: Split-screen with features and preview
- **Key Features**:
  - Stock tracking, harvest planning, quality grades, batch tracking
  - Mock inventory items with status indicators
  - Order management preview
  - Getting started tips

### 5. Seller Payments Step

- **Purpose**: Set up payment information and payout schedule
- **Content**: Payout schedules, payment methods, account details
- **Layout**: Two-column with form and security info
- **Key Features**:
  - Payout schedule selection (daily, weekly, monthly)
  - Payment method options (bank transfer, digital wallet)
  - Secure account information collection
  - Payout preview calculator
  - Security and compliance information

### 6. Seller Wrap Up Step

- **Purpose**: Celebrate completion and guide next steps
- **Content**: Success message, farm summary, recommended actions
- **Layout**: Two-column with celebration and next steps
- **Key Features**:
  - Confetti animation and success celebration
  - Personalized farm profile summary
  - Next step recommendations (add products, setup inventory, view analytics)
  - Seller support contact information

## Seller-Specific Features

### Farm Profile Data

- **Farm Types**: Family, Commercial, Organic, Cooperative
- **Farm Sizes**: Small (<10 acres), Medium (10-100), Large (100-1000), Enterprise (>1000)
- **Certifications**: Organic, GAP, Fair Trade, Rainforest Alliance, Non-GMO, Sustainable
- **Farming Methods**: Conventional, Organic, Biodynamic, Permaculture, Hydroponic, Greenhouse

### Product Categories

- **Fruits**: Apples, Oranges, Berries, Stone Fruits
- **Vegetables**: Leafy Greens, Root Vegetables, Squash, Peppers
- **Herbs & Spices**: Basil, Cilantro, Oregano, Thyme
- **Grains & Legumes**: Wheat, Corn, Beans, Lentils
- **Nuts & Seeds**: Almonds, Walnuts, Sunflower Seeds
- **Specialty Crops**: Flowers, Mushrooms, Microgreens

### Payment Configuration

- **Payout Schedules**: Daily (0.5% fee), Weekly (0.3% fee), Monthly (0.1% fee)
- **Payment Methods**: Bank Transfer, Digital Wallet, Paper Check (coming soon)
- **Security Features**: Bank-level encryption, PCI DSS compliance
- **Payout Preview**: Real-time calculation of fees and net payout

## Styling & Aesthetics

### CSS Architecture

- **Base Styles**: Imports buyer onboarding CSS for consistency
- **Seller Overrides**: Farm-focused color variations and components
- **Shared Components**: Reuses progress indicators, buttons, forms
- **Custom Elements**: Farm-specific cards, certification badges, seasonal calendar

### Visual Elements

- **Farm Imagery**: Agricultural scenes, farm equipment, fresh produce
- **Color Palette**: Same as buyer with farm-focused accents
- **Icons**: Farm and agriculture-themed emojis and symbols
- **Animations**: Gentle hover effects, success celebrations

### Responsive Design

- **Mobile**: Single-column layouts, touch-friendly controls
- **Tablet**: Two-column where appropriate, optimized forms
- **Desktop**: Full two-column layouts with rich previews

## Analytics & Telemetry

### Tracked Events

- `seller_onboarding_step_complete`: Step completion tracking
- `seller_onboarding_complete`: Full flow completion
- `seller_onboarding_abandoned`: Abandonment tracking

### Success Metrics

- Seller onboarding completion rate
- Time to first product listing
- Payment setup completion rate
- Seller activation within 7 days

## Integration Points

### API Connections (Future)

- Farm profile creation and validation
- Certification verification
- Payment processor integration
- Product category mapping
- Inventory system initialization

### Dashboard Integration

- Seamless transition to seller dashboard
- Pre-populated farm profile
- Quick access to recommended actions
- Onboarding progress tracking

## Accessibility Features

### WCAG Compliance

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion setting

### Seller-Specific Accessibility

- **Form Validation**: Clear error messages and guidance
- **Progress Indication**: Visual and screen reader accessible progress
- **Payment Security**: Clear security messaging and validation

## Development Notes

### Shared Components

- Reuses buyer onboarding progress indicator pattern
- Extends buyer CSS for consistent styling
- Shares animation and transition patterns
- Uses same responsive breakpoints

### Seller Customizations

- Farm-specific form fields and validation
- Agricultural product categories
- Payment and payout configurations
- Seller success metrics and next steps

### Performance Considerations

- **Code Splitting**: Each step component is lazy-loadable
- **Image Optimization**: Next.js Image component with proper sizing
- **CSS Optimization**: Extends buyer CSS to minimize bundle size
- **Animation Performance**: CSS-based animations with reduced motion support

## Testing Checklist

### Functional Testing

- [ ] All form validations work correctly
- [ ] Step navigation functions properly
- [ ] Data persistence between steps
- [ ] Payment form validation and security
- [ ] Responsive design across breakpoints

### Accessibility Testing

- [ ] Keyboard navigation works throughout flow
- [ ] Screen reader announces all content properly
- [ ] Focus management works correctly
- [ ] High contrast mode displays properly
- [ ] Reduced motion preferences respected

### Cross-Browser Testing

- [ ] Chrome, Firefox, Safari, Edge compatibility
- [ ] Mobile browser testing (iOS Safari, Chrome Mobile)
- [ ] Touch interaction testing on mobile devices

## Future Enhancements

### Advanced Features

- **Photo Upload**: Farm and product image uploads during onboarding
- **Certification Verification**: Integration with certification bodies
- **Market Analysis**: Show potential earnings based on location and products
- **Mentorship Program**: Connect new sellers with experienced farmers

### Integration Improvements

- **Real-Time Validation**: Live validation of farm information
- **Payment Verification**: Instant bank account verification
- **Product Suggestions**: AI-powered product category suggestions
- **Seasonal Optimization**: Location-based seasonal availability suggestions

## Usage

To navigate to the seller onboarding flow:

```
/seller/onboarding
```

The flow automatically redirects to `/seller` (seller dashboard) upon completion.

## Maintenance

### Regular Updates

- Update product categories based on market trends
- Refresh certification options as new standards emerge
- Update payment processing fees and schedules
- Refresh farm imagery and statistics

### Performance Monitoring

- Track completion rates and abandonment points
- Monitor form validation error rates
- Analyze time spent on each step
- Measure seller activation post-onboarding
