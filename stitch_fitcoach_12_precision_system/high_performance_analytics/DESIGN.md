---
name: High Performance Analytics
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffffff'
  on-secondary: '#283500'
  secondary-container: '#c3f400'
  on-secondary-container: '#556d00'
  tertiary: '#fff3f1'
  on-tertiary: '#690003'
  tertiary-container: '#ffcec7'
  on-tertiary-container: '#c1000a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#c3f400'
  secondary-fixed-dim: '#abd600'
  on-secondary-fixed: '#161e00'
  on-secondary-fixed-variant: '#3c4d00'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  data-point:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-regular:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style
The design system is engineered for a high-performance health-tech environment, specifically targeting a demographic focused on precision, data-driven results, and professional-grade fitness coaching. The brand personality is authoritative, analytical, and uncompromisingly masculine.

The aesthetic follows a **Corporate / Modern** approach with **Minimalist** and **Technical** influences. It utilizes a "Dark Mode First" philosophy to evoke a sense of premium hardware and elite performance labs. Visual weight is distributed through high-contrast accents against a monochromatic deep background, ensuring that data visualization remains the primary focus. The emotional response should be one of "Expert Control"—the user is not just exercising, but optimizing a complex biological system.

## Colors
The palette is built on a foundation of "Deep Space" tones to minimize eye strain and maximize the vibrance of technical data.

- **Primary (Electric Blue - #00F0FF):** Used for active states, primary call-to-actions, and "System Go" indicators. It represents technological precision.
- **Secondary (Cyber Lime - #CCFF00):** Used for positive growth, peak performance zones, and successful completion of goals.
- **Surface Neutrals:** A range of grises starting from `#0A0A0A` (Base) to `#1E1E1E` (Surface) and `#2C2C2C` (Elevated).
- **Status Indicators (Traffic Light):**
  - **Success:** Cyber Lime (#CCFF00)
  - **Warning:** Vivid Amber (#FFCC00)
  - **Critical:** Racing Red (#FF3B30)

## Typography
The typography strategy employs a dual-font approach to separate narrative from data. 

**Inter** serves as the primary typeface for all UI elements, headings, and body copy, providing a clean, Swiss-style legibility that feels professional and contemporary. 

**JetBrains Mono** is utilized for all numerical data, timestamps, and technical labels. This monospaced choice reinforces the "analytical instrument" feel of the interface, ensuring that columns of numbers align perfectly for easy scanning during intense workouts or deep-dive reviews. Headlines should use tight tracking (letter-spacing) to appear more impactful and "engineered."

## Layout & Spacing
The system uses a **Fixed Grid** on desktop and a **Fluid Grid** on mobile, built on a strict 4px baseline rhythm.

- **Desktop:** 12-column grid with a 1280px max-width. Gutters are fixed at 16px to maintain a dense, information-rich environment.
- **Mobile:** 4-column fluid grid with 16px side margins.
- **Spacing Logic:** Vertical rhythm follows multiples of 4px. Use 8px/16px for internal component padding and 24px/32px/48px for sectional layout separation.

Layouts should prioritize a "Dashboard" feel, where the most critical performance metrics are visible above the fold without the need for excessive scrolling.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows. 

The background is the lowest layer (#0A0A0A). Cards and containers sit on the second layer (#121212). High-priority interactive elements or modals sit on the third layer (#1E1E1E).

To define boundaries, use subtle 1px borders in a slightly lighter gray (#2C2C2C). For active elements, these borders may "glow" with a low-opacity primary color (Electric Blue) stroke. Avoid heavy drop shadows to maintain a flat, technical, "glass-cockpit" aesthetic.

## Shapes
The shape language is disciplined and geometric. A "Soft" (`0.25rem`) corner radius is applied to most UI components to prevent the interface from feeling dangerously sharp while maintaining a precise, architectural silhouette.

- **Buttons & Inputs:** 4px (Soft)
- **Data Cards:** 8px (Rounded-lg)
- **Selection Indicators:** 2px or 0px for a more "industrial" feel.

## Components

### Buttons
Primary buttons use a solid Electric Blue fill with black text for maximum contrast. Secondary buttons use a ghost style (1px border) with JetBrains Mono labels. All buttons have a high-hover state brightness shift.

### Cards & Data Visualization
Cards are the primary container. They feature a 1px border (#2C2C2C) and no shadow. Inside, charts should use high-fidelity vector lines. Trends are indicated by small "Traffic Light" dots (Cyber Lime for up, Racing Red for down).

### Status Indicators
Use "Semáforo" (Traffic Light) logic:
- **Optimal (12% Body Fat Range):** Cyber Lime.
- **Caution:** Vivid Amber.
- **Action Required:** Racing Red.
Indicators should be small, circular pips or thin vertical bars next to data points.

### Inputs
Text fields are dark-filled (#0A0A0A) with a subtle bottom border. On focus, the border becomes Electric Blue with a faint outer glow. Labels always use JetBrains Mono in uppercase for a "technical spec" look.

### Lists
Lists are separated by thin 1px lines. Each list item should treat data (e.g., weights, reps) as the primary visual anchor, using the monospaced font at a larger scale than the descriptive text.