

# Website Beautification Plan

Here is a summary of all the improvements, organized by area:

---

## 1. Catering Page -- Fix Hero Text Overlap

**Problem:** The hero has both "Elevated Catering" (from a previous version) and "Catering Services" overlapping.

**Fix:** Clean up to show only one heading ("Catering Services") with the subtitle and CTA button, properly spaced. No text overlap.

---

## 2. Locations Page -- Add Visual Warmth

**Problem:** The page has a plain brown gradient hero with no imagery. It feels bare and disconnected from the rest of the site.

**Changes:**
- Replace the plain gradient hero with a full-height hero image using one of the existing cafe interior images (e.g., `home-interior-new.jpg`) with a dark overlay and elegant Cinzel typography (matching the homepage hero style).
- Restyle the 3 info cards (Address, Phone, Hours) with a more premium look -- subtle hover effects, larger icons, and the Cinzel font for headings.
- Add more vertical breathing room around the map embed.

---

## 3. Contact Page -- Add Hero and Visual Polish

**Problem:** The page jumps straight into the contact cards with no visual introduction. Feels purely functional.

**Changes:**
- Add a hero section at the top of the Contact page (similar style to the Locations page hero) with a cafe image, dark overlay, and "Contact Us" heading in Cinzel font.
- Replace the emoji icons (pin, phone, email) in the contact cards with proper Lucide icons for a more polished look.
- Improve the card styling with subtle borders and refined spacing.

---

## 4. Homepage "Visit NAWA Cafe" Section -- Elevate Design

**Problem:** The 3 info cards look generic and template-like with basic rounded boxes.

**Changes:**
- Restyle cards with a more refined look: remove the circular icon containers and instead use inline icons next to headings.
- Add a subtle background texture or warm gradient behind the entire section.
- Use the Cinzel font consistently for headings.
- Make the section feel more integrated with the rest of the premium homepage design.

---

## 5. Footer -- Update Copyright Year

**Problem:** Footer says "2024" but it's 2026.

**Fix:** Change the hardcoded "2024" to "2026" (or use dynamic year via `new Date().getFullYear()`).

---

## 6. Cookie Banner -- Make Less Obtrusive

**Problem:** The cookie banner is large and heavy, covering significant screen space on every page load.

**Changes:**
- Make the banner more compact: reduce padding, use a single-line layout on desktop with buttons inline.
- On mobile, keep it slim with stacked buttons but less padding.
- This keeps compliance while reducing visual disruption.

---

## Technical Details

**Files to modify:**
- `src/pages/LocationsPage.tsx` -- New hero with image, restyled info cards
- `src/pages/ContactPage.tsx` -- Add hero section
- `src/components/Contact.tsx` -- Replace emojis with Lucide icons, restyle cards
- `src/components/HomeVisit.tsx` -- Restyle the visit section cards
- `src/components/Footer.tsx` -- Update copyright year to dynamic
- `src/components/CookieConsent.tsx` -- Compact layout
- `src/pages/CateringPage.tsx` -- Verify hero has no text overlap (may already be fixed)

**No new dependencies needed.** All changes use existing Tailwind classes, Lucide icons, and Cinzel/Playfair fonts already in the project.

