---
trigger: always_on
---


## Component Architecture Rules

1. Build reusable components in separate files and import them wherever needed.

2. Reuse shared UI components such as buttons, inputs, badges, modals, navigation, cards, and form elements.

3. Keep page-specific layouts and one-off sections local to their page unless extracting them improves readability, maintainability, or reuse.

4. Follow the existing project architecture and naming conventions. Do not introduce a new component structure without a clear reason.

5. Use props and composition for legitimate variations instead of duplicating nearly identical components.

6. Keep components focused on a clear responsibility. Avoid oversized components that combine unrelated UI and business logic.

7. Apply shared design tokens and styling rules consistently across all components.

8. Before creating a new component, check whether an existing component already serves the same purpose. Extend it when appropriate rather than creating duplicates.

9. Avoid unnecessary abstractions. Reusability should improve maintainability, consistency, or development speed.

10. When modifying shared components, check their existing usages and avoid breaking unrelated pages or workflows.

Core principle: Build for consistency and maintainability without overengineering.
