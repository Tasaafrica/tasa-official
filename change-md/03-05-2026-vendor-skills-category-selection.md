# Vendor Skills and Category Selection Update

**Date:** May 10, 2026  
**Type:** Feature  
**Files Modified:** 5 files updated

## Changes Made

### Updated Files

- `src/lib/vendor.ts` - Added Category and Skill interfaces with API functions
- `src/app/v/settings/page.tsx` - Implemented category dropdown and skills selection grid
- `src/app/[role]/components/VendorSidebar.tsx` - Fixed sidebar to non-scrollable
- `src/app/v/layout.tsx` - Added margin-left to main content for fixed sidebar

## Implementation Details

### API Functions Added

#### Category Interface

```typescript
export interface Category {
  _id: string;
  name: string;
  slug: string;
}
```

#### Skill Interface

```typescript
export interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}
```

#### getCategories

- Fetches all categories from `/api/categories`
- Returns standardized ApiResponse<Category[]>
- Used to populate category dropdown

#### getSkillsByCategory

- Fetches skills for a specific category from `/api/categories/{slug}/skills`
- Returns standardized ApiResponse<Skill[]>
- Used to populate skills selection grid

### Settings Page Updates

#### Category Selection

- Replaced text input with dropdown selector
- Categories fetched from API on component mount
- Auto-selects current vendor category when data loads
- Updates both slug and name state on selection

#### Skills Selection UI

- Grid layout for skill selection (2-4 columns responsive)
- Toggle buttons for selecting/deselecting skills
- Visual feedback: selected skills have indigo styling
- Core/Peripheral type selector appears on selected skills
- Skills fetched dynamically based on selected category

#### Skills Summary Section

- Shows all selected skills
- Separates Core Skills and Peripheral Skills
- Core skills displayed with indigo background
- Peripheral skills displayed with gray background
- Remove button (X) on each skill tag
- Empty state messages when no skills selected

#### State Management

- `categories`: Array of available categories
- `availableSkills`: Array of skills for selected category
- `selectedCategorySlug`: Currently selected category slug
- `selectedSkills`: Array of selected skill names
- `skillTypes`: Record mapping skill name to type (core/peripheral)
- `isLoadingCategories`: Loading state for categories
- `isLoadingSkills`: Loading state for skills
- `hasLoadedInitialSkills`: Flag to prevent overwriting initial category selection

#### Data Flow

1. Component mounts → fetch categories
2. Vendor data loads → auto-select matching category
3. Category changes → fetch skills for that category
4. User selects skill → add to selectedSkills with default type
5. User changes skill type → update skillTypes record
6. Save → separate skills by type and send to API

### Save Functionality

- Separates selected skills by type (core/peripheral)
- Maps skill names to API format: `[{ name: "Skill Name" }]`
- Sends both coreSkills and peripheralSkills arrays to update endpoint
- Refreshes vendor data after successful save

## UI Features

### Category Dropdown

- Clean select dropdown with category names
- "Select a category" placeholder
- Loading state indicator
- Disabled while loading

### Skills Grid

- Responsive grid: 2 columns mobile, 3 tablet, 4 desktop
- Toggle buttons with hover effects
- Selected state: indigo border and background
- Unselected state: gray border and white background
- Type selector (dropdown) on selected skills
- Compact 10px font for type selector
- Skill limits: max 2 core skills, max 5 peripheral skills
- Error messages when limits are exceeded

### Skills Summary

- Border separator from skills grid
- Core Skills section with indigo tags
- Peripheral Skills section with gray tags
- Remove button (X) with hover effects
- Empty state messages in italic gray
- Displays existing vendor skills immediately on page load

### Sidebar

- Fixed position (non-scrollable) with h-screen
- Stays visible while main content scrolls
- Navigation items scrollable if needed
- Main content has ml-64 to account for fixed sidebar width

## Benefits

### User Experience

- No need to manually type skills
- Skills validated against database
- Clear visual distinction between core and peripheral
- Easy to add/remove skills with one click
- Consistent with become-a-vendor page patterns

### Data Quality

- Skills sourced from controlled vocabulary
- Reduced typos and inconsistencies
- Proper categorization enforced
- Better search and filtering capabilities

### Maintainability

- Centralized API functions
- Type-safe interfaces
- Reusable components
- Consistent error handling

## Technical Details

### API Endpoints Used

- GET `/api/categories` - Fetch all categories
- GET `/api/categories/{slug}/skills` - Fetch skills by category
- PUT `/api/vendors/{id}` - Update vendor profile

### Error Handling

- Loading states for async operations
- Graceful fallbacks for missing data
- User-friendly error messages
- Console logging for debugging

### Performance

- Categories fetched once on mount
- Skills cached per category
- Minimal re-renders with proper state management
- Efficient filtering and mapping operations
