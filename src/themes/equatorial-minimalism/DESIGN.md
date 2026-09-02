---
name: Equatorial Minimalism
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#44474d'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4e5f7d'
  primary: '#031631'
  on-primary: '#ffffff'
  primary-container: '#1a2b47'
  on-primary-container: '#8293b4'
  inverse-primary: '#b6c7ea'
  secondary: '#944931'
  on-secondary: '#ffffff'
  secondary-container: '#fd9d7f'
  on-secondary-container: '#77331c'
  tertiary: '#171714'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b2b28'
  on-tertiary-container: '#93928e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  success: '#36734d'
  warning: '#9b6a0b'
  online: '#5b9c6e'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b6c7ea'
  on-primary-fixed: '#081b37'
  on-primary-fixed-variant: '#374765'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#76321c'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c9c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-padding: 80px
---

## Brand & Style
This design system embodies a high-end, contemporary aesthetic tailored for a modern African context. It balances the warmth of the earth with the precision of modern minimalism. The visual narrative is built on the principle of "spaciousness"—allowing content to breathe through generous whitespace and a calm, sophisticated palette. 

The style is **Modern Minimalism** infused with **Tactile Organicism**. It avoids clutter in favor of intentionality, using large-scale portraiture and subtle geometric patterns inspired by mud cloth to ground the digital experience in cultural heritage without being literal or overbearing. The emotional response should be one of quiet luxury, reliability, and cultural pride.

## Colors
The palette is rooted in the natural landscape. **Soft Sand (#F5F2ED)** serves as the primary canvas, replacing harsh whites to provide a warmer, more sophisticated background. **Deep Indigo (#1A2B47)** acts as the primary anchor for typography and structural elements, offering high contrast and a sense of authority. 

**Muted Terracotta (#BF6B50)** is used sparingly as an accent color for calls to action or key highlights, evoking the richness of the earth. Neutral tones are derived from desaturated versions of the Indigo to ensure harmony across the interface.

## Typography
The typography system uses **Montserrat** for headlines to convey a bold, urban energy, while **Inter** provides a highly legible, utilitarian foundation for body text and UI labels. 

To achieve the "Equatorial" feel, generous letter spacing is applied to labels and body text, creating an airy, open reading experience. Headlines use tighter tracking to maintain a strong visual punch. Text should primarily appear in Deep Indigo for maximum readability against the Soft Sand background.

## Layout & Spacing
The layout follows a **fluid 12-column grid** on desktop and a **4-column grid** on mobile. The defining characteristic is the use of "Extreme Margins"—large outer gutters (64px+) on desktop that compress the content into a focused central column, enhancing the premium feel.

Spacing follows an 8px linear scale. Section vertical padding is intentionally large (80px+) to separate distinct content blocks, reinforcing the calm and spacious mood. Elements should be grouped using proximity, but clusters should be separated by significant white space (or "sand space").

## Elevation & Depth
Depth is created through **Ambient Shadows** and **Tonal Layers**. Instead of harsh black shadows, elevations use low-opacity Indigo tints (#1A2B47 at 8-12% opacity) with high blur radiuses (20px-40px) to create a soft, "lifting" effect.

Cards and surfaces sit slightly above the Soft Sand base. A subtle "inner glow" or 1px border in a slightly darker sand shade can be used to define boundaries without adding visual weight. Patterns should be applied as low-contrast watermarks on background layers, never competing with foreground content.

## Shapes
The shape language is defined by **Rounded (0.5rem)** corners. This softens the minimalist structure, making the interface feel more approachable and organic. 

Image containers, especially those featuring portraits, should utilize these rounded corners. For specific interactive elements like chips or secondary buttons, a more pronounced "pill" shape may be used to differentiate them from primary structural cards.

## Components
- **Buttons**: Primary buttons are solid Deep Indigo with white text, using the `rounded-lg` setting. Secondary buttons use a Terracotta outline with high letter-spaced uppercase labels.
- **Cards**: Cards feature a Soft Sand background that is 2-3% lighter than the main page background, paired with a soft ambient shadow. Large imagery should bleed to the top and sides of the card.
- **Inputs**: Text fields use a minimalist "bottom-border only" approach or a very light Indigo outline (10% opacity). Focus states transition the border to solid Terracotta.
- **Chips/Tags**: Small, pill-shaped elements with Soft Sand backgrounds and Deep Indigo text, used for categorization without cluttering the view.
- **Portrait Masks**: Use subtle geometric shapes (derived from mud cloth patterns) as mask overlays for secondary portraiture to add cultural texture.
- **Lists**: Interactive lists use generous vertical padding (24px+) between items, separated by a thin, low-contrast 1px line.

## IM-Specific Components

### Chat Bubbles
- **Sent messages**: Soft Indigo tint background (#1A2B47 at 8% opacity) with Deep Indigo text
- **Received messages**: White/Surface background with Deep Indigo text
- **Border radius**: 1rem for all corners except the tail corner (0.25rem)
- **Padding**: 12px 16px for comfortable reading
- **Max width**: 75% of container

### Avatar
- **Size variants**: sm (32px), md (48px), lg (64px), xl (96px)
- **Shape**: Fully rounded (circle) for personal chats, rounded-lg for group/community contexts
- **Border**: 2px solid Surface color for separation
- **Status indicator**: Small dot (8px) positioned at bottom-right, using Secondary (Terracotta) for online

### Input Bar
- **Background**: Surface-container color
- **Border radius**: Full pill shape (9999px)
- **Padding**: 12px 20px
- **Placeholder**: On-surface-variant at 60% opacity
- **Send button**: Secondary (Terracotta) background with white icon

### Navigation
- **Tab bar**: Floating style with ambient shadow, positioned 20px from bottom
- **Active state**: Secondary (Terracotta) color indicator
- **Icon style**: Outlined by default, filled when active
- **Labels**: Label-sm typography, uppercase
