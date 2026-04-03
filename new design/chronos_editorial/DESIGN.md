# Design System: Modern Editorial / Premium SaaS

## 1. Overview & Creative North Star: "The Digital Curator"

This design system is built upon the philosophy of **"The Digital Curator."** It rejects the rigid, cookie-cutter "block" layouts of standard SaaS templates in favor of a sophisticated, editorial-inspired experience. We treat the interface as a premium publication where whitespace is a luxury, and information is curated rather than simply displayed.

### The Creative North Star
*   **Intentional Asymmetry:** We break the 12-column monotony. By offsetting text blocks and using overlapping imagery, we guide the eye through a narrative rather than a grid.
*   **Tonal Depth:** We move away from flat UI by using "Physical Layering"—stacking surfaces of varying tones to create natural hierarchy.
*   **High-Contrast Sophistication:** The interplay between the utilitarian `Inter` and the expressive `Epilogue` display face creates a "veteran designer" aesthetic—functional, yet deeply stylish.

---

## 2. Colors & Surface Philosophy

Our palette is anchored in Deep Indigo and Electric Blue, but its success relies on the "Soft Slate" neutrals that allow the primary colors to feel like deliberate accents rather than overwhelming fills.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` (#f7f9fb) to `surface-container-low` (#f2f4f6).
2.  **Vertical Space:** Utilizing the spacing scale to create mental groupings.
3.  **Tonal Transitions:** Using subtle shifts in color value to denote change.

### Surface Hierarchy & Nesting
Treat the UI as physical sheets of paper or glass. 
*   **Base:** `surface` (The canvas).
*   **Containers:** Use `surface-container-low` for large background sections and `surface-container-highest` for elevated interactive elements.
*   **The Glass Rule:** For navigation and floating elements, use `surface` at 70% opacity with a `backdrop-blur` (20px-40px). This ensures the layout feels integrated and fluid.

### Signature Textures
Main CTAs and Hero accents should utilize a subtle linear gradient: 
`primary` (#000928) → `primary-container` (#001d58) at a 135-degree angle. This adds a "weighted" feel that flat hex codes cannot achieve.

---

## 3. Typography: The Editorial Voice

We pair a high-character display font with a high-utility sans-serif to create an authoritative, premium tone.

*   **Display & Headlines (Epilogue):** Used for storytelling. `display-lg` should be treated as a visual element, often paired with tighter tracking (-0.02em) to give it a dense, intentional feel.
*   **Body & Labels (Inter):** Used for functionality. `body-md` is our workhorse. Always use "Optical" sizing and tight tracking for high-end SaaS legibility.

| Level | Token | Font | Size | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `display-lg` | Epilogue | 3.5rem | 700 |
| **Section Head** | `headline-md` | Epilogue | 1.75rem | 600 |
| **Small Title** | `title-sm` | Inter | 1rem | 600 |
| **Main Body** | `body-lg` | Inter | 1rem | 400 |
| **Caption** | `label-md` | Inter | 0.75rem | 500 |

---

## 4. Elevation & Depth: The Layering Principle

Shadows and borders in this system are "ambient," mimicking natural light rather than digital effects.

*   **Tonal Layering:** Instead of a shadow, place a `surface-container-lowest` (#ffffff) card on top of a `surface-container-low` (#f2f4f6) background. This creates "soft lift."
*   **Ambient Shadows:** For floating elements (Modals, Dropdowns), use a shadow with a blur radius of at least 40px and an opacity between 4% and 8%. The shadow color must be a tint of `on-surface` (#191c1e), never pure black.
*   **The Ghost Border:** If a divider is mandatory for accessibility, use the `outline-variant` token at 15% opacity. **Never use 100% opaque lines.**

---

## 5. Components

### Buttons (The "Jewel" Actions)
*   **Primary:** Background: `on-primary-container` (#5382ff); Text: `on-primary` (#ffffff). Border-radius: `xl` (1.5rem). Use a subtle inner-glow on hover.
*   **Secondary:** Ghost style. No background, `outline-variant` ghost border (20% opacity), text: `primary`.
*   **Tertiary:** Text only. Use `title-sm` with an animated underline on hover.

### Inputs & Fields
*   **Visual Style:** Forgo the 4-sided box. Use a `surface-container-high` background with a `md` radius. 
*   **Focus State:** Transition the background to `surface-container-lowest` and add a 2px `surface-tint` (#0053db) "Ghost Border."

### Cards & Lists
*   **Rule:** No dividers. Separate list items using 16px–24px of vertical padding.
*   **Asymmetrical Cards:** For editorial impact, vary the `xl` (1.5rem) corner radii—e.g., top-left and bottom-right at 24px, others at 12px—to create custom shapes for rich imagery.

### Contextual Components: "The Timekeeper"
*   **Editorial Progress Bars:** Use a ultra-thin 2px track in `outline-variant` with a high-contrast `on-primary-container` fill.
*   **Glass Nav:** A fixed top-bar using `surface` at 80% opacity, `backdrop-blur-xl`, and a `bottom-edge` ghost border at 10% opacity.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., 15% left, 5% right) to create a "magazine" feel.
*   **Do** overlap elements. Let an image bleed behind a text container to create depth.
*   **Do** use high-quality, desaturated imagery that leans into the Deep Indigo/Slate palette.

### Don't
*   **Don't** use "Default" shadows (0, 4, 10, 0). They feel cheap.
*   **Don't** put a border around everything. Trust the background color shifts to define space.
*   **Don't** use pure black (#000000). Always use `primary` (#000928) or `on-surface` (#191c1e) for text to maintain tonal richness.