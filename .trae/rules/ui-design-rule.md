<!-- @format -->

# UI Visual Standards: "Frontend Quest" (Learning Path Style)

You are a senior UI/UX designer. This project is a gamified frontend learning platform.
The UI must feel professional, technical, and rewarding.

## 1. Visual Style: "The Technical Minimalist"

- **Aesthetic:** A blend of Linear's precision and Apple's clean spacing.
- **Palette:** - Primary: Deep Slate/Black (#09090B) for text/background.
  - Accent: A single "Brand Color" (e.g., Electric Blue #3B82F6 or Emerald #10B981) to represent progress and completion.
  - Background: Pure White (#FFFFFF) for light mode or Rich Black (#09090B) for dark mode.
- **Surfaces:** Use "Bento Box" layout. Group information into discrete cards with 1px subtle borders (#E5E7EB) and 12px/16px border-radius.

## 2. Typography & Hierarchy

- **Font:** Inter or San Francisco. Use tabular numbers for progress stats.
- **Headers:** Semi-bold, tight tracking (-0.02em).
- **Body:** High readability, 1.6 leading. Use 14px for metadata and 16px for primary text.

## 3. Gamification Elements (The "Quest" Look)

- **Progress Bars:** Thin, sleek bars without heavy shadows. Use gradients sparingly only on the progress fill.
- **Badges:** Small, monochrome icons that light up in color only when "Unlocked."
- **Status Indicators:** Use subtle glows (ring-opacity) to indicate "Current Active Level."

## 4. Interaction & Feedback

- **Transitions:** Every hover state should have a 0.2s ease-in-out.
- **Micro-interactions:** Use subtle scaling (scale-95) on button clicks to provide tactile feedback.
- **Empty States:** Use dotted borders or light gray patterns to indicate "Locked Content."

## 5. Technical Implementation (Tailwind)

- Use `gap-6` for main layouts to ensure "breathing room."
- Use `backdrop-blur` for sticky headers.
- Prefer `Lucide-React` icons with a consistent `stroke-width={1.5}`.

## 6. Visual Refinement (Polish)

- **Depth:** Use `ring-1 ring-white/10` and `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` for active cards to create a floating effect.
- **Typography:** Metadata (Time, Difficulty) should use Monospace fonts (e.g., JetBrains Mono) at 12px for a "Terminal" feel.
- **Micro-Animation:** Active quest markers should have a subtle `pulse` animation on their outer glow.
- **Card Content:** Use 80% opacity for secondary descriptions; keep 100% opacity only for Titles and Primary Actions to ensure a clear information hierarchy.
- **Empty States:** Use a 45-degree subtle stripe pattern (background-size: 20px 20px) for locked modules instead of just gray.
