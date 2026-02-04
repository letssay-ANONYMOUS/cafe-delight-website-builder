
# Instant Loading Strategy - Hero Sections & Page-Specific Card Loading

## Current State Analysis

### Hero Images Found:
| Page | Image Source | Current Loading | Issue |
|------|-------------|-----------------|-------|
| Home (Hero.tsx) | Unsplash URL | `loading="eager"` + `fetchPriority="high"` | Already optimized |
| Catering | Local asset (`catering-hero.png`) | No loading attribute | **SLOW - needs fix** |
| Locations | No hero image (gradient only) | N/A | No change needed |
| About | 4 grid images | No loading attribute | **Needs eager loading** |

### Card Images:
| Component | Current Loading | Behavior Needed |
|-----------|-----------------|-----------------|
| MenuCard.tsx | `loading="lazy"` | Eager when ON menu page, lazy elsewhere |
| StoreProductCard.tsx | No attribute | Eager when ON store page, lazy elsewhere |
| Menu.tsx category thumbnails | `loading="eager"` | Already correct |

---

## Implementation Plan

### 1. Fix Catering Hero (Instant Load)

**File**: `src/pages/CateringPage.tsx`

Add eager loading attributes to the hero image:
```tsx
<img 
  src={cateringHeroImage} 
  alt="NAWA Café Catering Services" 
  loading="eager"
  decoding="async"
  fetchPriority="high"
  className="w-full h-full object-cover"
/>
```

### 2. Fix About Page Images (Instant Load)

**File**: `src/components/About.tsx`

Add eager loading to all 4 grid images:
```tsx
<img
  src={aboutCoffee1}
  alt="Premium coffee with latte art"
  loading="eager"
  decoding="async"
  fetchPriority="high"
  className="..."
/>
```

### 3. Smart Card Loading Based on Current Page

**File**: `src/components/MenuCard.tsx`

Pass a prop to control loading behavior:
```tsx
interface MenuCardProps {
  item: {...};
  cardNumber?: number;
  eagerLoad?: boolean;  // NEW: Controls loading strategy
  onEdit?: () => void;
  onDelete?: () => void;
}

// In the img tag:
<img
  src={item.image}
  alt={item.name}
  loading={eagerLoad ? "eager" : "lazy"}
  decoding="async"
  fetchPriority={eagerLoad ? "high" : "auto"}
  className="..."
/>
```

**File**: `src/components/Menu.tsx`

Pass `eagerLoad={true}` since this component only renders on the menu page:
```tsx
<MenuCard
  key={item.id}
  item={cardItem}
  cardNumber={item.card_number}
  eagerLoad={true}  // All cards load instantly on menu page
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item)}
/>
```

### 4. Store Product Cards (Instant Load on Store Page)

**File**: `src/components/StoreProductCard.tsx`

Add eager loading since this component only renders on the store page:
```tsx
<img 
  src={product.image} 
  alt={product.name}
  loading="eager"
  decoding="async"
  fetchPriority="high"
  className="..."
/>
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/pages/CateringPage.tsx` | Add `loading="eager"` + `fetchPriority="high"` to hero image |
| `src/components/About.tsx` | Add eager loading to all 4 grid images |
| `src/components/MenuCard.tsx` | Add `eagerLoad` prop to control loading behavior |
| `src/components/Menu.tsx` | Pass `eagerLoad={true}` to MenuCard |
| `src/components/StoreProductCard.tsx` | Add eager loading to product images |

---

## Technical Notes

- `loading="eager"` = Browser loads image immediately (not deferred)
- `fetchPriority="high"` = Browser prioritizes this resource in the network queue
- `decoding="async"` = Browser decodes image off main thread (doesn't block rendering)

This ensures:
1. All hero sections load instantly across the site
2. Menu cards load instantly when customer opens /menu
3. Store cards load instantly when customer opens /store
4. Cards remain lazy-loaded if referenced from other pages (future-proofing)
