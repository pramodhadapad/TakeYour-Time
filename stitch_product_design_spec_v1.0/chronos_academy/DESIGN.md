# Design System Specification: The Academic Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Intellectual Atelier"**
This design system moves away from the generic "SaaS dashboard" aesthetic to embrace a high-end, editorial feel. We treat educational booking not as a utility, but as a premium service. The system balances corporate trustworthiness with an avant-garde approach to layout—using intentional white space, exaggerated typographic scales, and layered depth to guide the user’s journey.

**The Signature Style:**
*   **Intentional Asymmetry:** Break the grid for hero sections and profile headers to create a custom, "bespoke" feel.
*   **Tonal Fluidity:** We reject the rigidity of boxes. Elements flow into one another through background shifts rather than hard outlines.
*   **Breathable Luxury:** High spacing values (`spacing-12` and `spacing-16`) are used to separate major cognitive sections, ensuring the platform feels "calm" despite complex scheduling data.

---

## 2. Colors & Surface Philosophy

### Color Tokens
We utilize a sophisticated Material-based palette to ensure tonal depth.
*   **Primary (`#2563EB`):** Our "Intellectual Blue." Used for high-priority actions.
*   **Secondary (`#712AE2`):** Our "Focus Violet." Used for accentuation and waitlist statuses.
*   **Tertiary (`#006329`):** Our "Success Emerald." For confirmed bookings and growth metrics.
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: `#ffffff` (Main content cards)
    *   `surface-container-low`: `#f2f3ff` (Section backgrounds)
    *   `surface`: `#faf8ff` (Global background)

### The "No-Line" Rule
**Prohibition:** 1px solid borders (`#E2E8F0`) are strictly forbidden for sectioning or card definition. 
**Implementation:** Boundaries must be defined by shifts in background color. A tutor card (`surface-container-lowest`) should sit atop a search results area (`surface-container-low`). The contrast is subtle but creates a sophisticated, "borderless" interface that feels more like a modern publication than a database.

### The Glass & Gradient Rule
To instill a "Premium" feel, use **Glassmorphism** for floating navigation bars and modals:
*   **Background:** `surface-container-lowest` at 80% opacity.
*   **Effect:** `backdrop-blur: 12px`.
*   **Gradient Accents:** Use a subtle linear gradient from `primary` (`#2563EB`) to `primary-container` (`#2563eb`) on primary buttons and hero icons to provide "visual soul."

---

## 3. Typography
We leverage **Inter** across all scales, but we differentiate through weight and letter-spacing to achieve an editorial hierarchy.

| Level | Size | Weight | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | 3.5rem | 700 | -0.02em | Hero headlines / Landing pages |
| **Headline-MD** | 1.75rem | 600 | -0.01em | Section headers |
| **Title-SM** | 1.0rem | 600 | 0 | Card titles / Form headers |
| **Body-LG** | 1.0rem | 400 | 0 | Standard reading text |
| **Label-MD** | 0.75rem | 500 | 0.05em | Uppercase subtitles / Metadata |

**Editorial Note:** Always pair a `Display-LG` header with a `Body-LG` subline. The high contrast in size conveys authority and premium positioning.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved by stacking surface tiers. 
*   **Level 0:** `surface` (The canvas).
*   **Level 1:** `surface-container-low` (Content groupings/wrappers).
*   **Level 2:** `surface-container-lowest` (The interactive card or "active" element).

### Ambient Shadows
Avoid the default "Drop Shadow." For floating elements (Modals/Popovers), use:
*   **Shadow:** `0px 20px 40px rgba(15, 23, 42, 0.06)`
*   **Color Tint:** Shadows must use a 6% opacity of `on-surface` (`#131b2e`) to feel integrated with the environment.

### The "Ghost Border"
When accessibility requires a boundary (e.g., Input fields), use a **Ghost Border**: 
*   Token: `outline-variant` (`#c3c6d7`) at **20% opacity**. It should be felt, not seen.

---

## 5. Components (shadcn/ui Customization)

### Buttons
*   **Primary:** Background `primary` (`#2563EB`), text `on-primary`. 12px horizontal padding. Slight linear gradient to `primary-dark`.
*   **Secondary:** Background `surface-container-high`, text `primary`. No border.
*   **Radius:** Always `md` (10px) for buttons to maintain a modern, approachable edge.

### Status Badges (The "Tonal Pill")
*   **Confirmed:** `tertiary-container` background with `on-tertiary-fixed-variant` text.
*   **Pending:** Amber-50 background with Amber-700 text.
*   **Waitlisted:** `secondary-container` background with `on-secondary-fixed` text.
*   **Style:** No borders. Pill-shaped (`rounded-full`).

### Inputs & Fields
*   **Surface:** `surface-container-lowest`.
*   **State:** On focus, transition border-color from "Ghost" to `primary` with a 2px outer glow of `primary` at 10% opacity.
*   **Labeling:** `label-md` placed 8px above the field.

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Separation:** Use `spacing-4` (1rem) for vertical separation between items. For lists, use a alternating background of `surface-container-lowest` and `surface-container-low` to define rows.

### Tutor-Specific Component: The "Availability Heatmap"
*   Use a grid of `rounded-sm` squares. 
*   Empty slots: `surface-container-high`.
*   Booked slots: `primary` at 20% opacity.
*   Selected: `primary` (100%).

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins (e.g., 80px left, 120px right) on large display layouts to create a custom-designed feel.
*   **Do** prioritize `body-lg` for tutor bios; large type is easier to read and feels more "trustworthy."
*   **Do** use `backdrop-blur` on navigation headers to maintain context as users scroll through tutor listings.

### Don’t
*   **Don’t** use pure black `#000000`. Use `on-surface` (`#131b2e`) for all dark text to maintain color harmony.
*   **Don’t** use hard shadows. If a component looks like it’s "pasted on" the page, increase the shadow blur and decrease opacity.
*   **Don’t** use 1px borders to separate content. Use the spacing scale (`spacing-8`+) or background color shifts.