# SCSS Architecture

## File Structure

```
scss/
├── _init.scss          # Main entry point (import this in components)
├── _tokens.scss        # Design tokens (variables)
├── _mixins.scss        # Reusable style patterns
└── README.md           # This file
```

## Usage

Import `_init.scss` in component SCSS files:

```scss
@import '../../assets/scss/init';
```

This gives you access to all tokens and mixins.

## Design Tokens (`_tokens.scss`)

### Colors
- `$color-primary` - Brand gold (#dcb244)
- `$color-secondary` - Professional teal (#98bfbf)
- `$color-text-*` - Text color variants
- `$color-border-*` - Border color variants
- `$color-bg-*` - Background color variants

### Spacing
- `$spacing-xs` through `$spacing-3xl` (4px to 48px)

### Typography
- `$font-size-xs` through `$font-size-2xl`
- Font family variables for Gilroy and Gotham

### Other
- `$radius-*` - Border radius values
- `$shadow-*` - Box shadow presets
- `$z-*` - Z-index scale
- `$transition-*` - Transition presets

## Mixins (`_mixins.scss`)

### Buttons
```scss
@include btn-primary;    // Gold filled button
@include btn-outline;    // Gold outline button
@include btn-ghost;      // Text-only button
```

### Form Elements
```scss
@include input-base;     // Standard text input
@include dropdown-container;
@include dropdown-item;
```

### Layout
```scss
@include modal-overlay;
@include modal-container;
```

## Migration Guide

When refactoring legacy SCSS:

1. Replace hardcoded colors with token variables
2. Replace repeated button styles with mixins
3. Replace magic numbers with spacing/radius tokens
4. Use z-index scale instead of arbitrary values

### Example

Before:
```scss
.my-button {
  background: #dcb244;
  border: 2px solid #dcb244;
  border-radius: 25px;
  padding: 14px 20px;
  font-family: 'Gilroy-Medium', sans-serif;
}
```

After:
```scss
.my-button {
  @include btn-primary;
}
```
