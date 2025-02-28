# Changelog

### isuues#59

[Affirmation] Allow the users to customize the size of affirmation banner display #59
https://github.com/aimpowered/LibOrate/issues/59

#### Features & Improvements

- **Component Refactor**  
  ⮕ Replaced `mui-carousel` with `react-slick` for responsive sizing and higher customization capabilities.  
  ⮕ Enabled infinite carousel looping via `infinite: true` configuration for seamless user navigation. 🎮  
  ⮕ Added `ResizeBox` wrapper component to enable drag-and-resize functionality.  
  ⮕ Refactored `float button` component to fix vertical asymmetry (removed fixed `top: 40px`).  
  ⮕ Added **New** button in float button overlay for quick item creation without last-page navigation.

#### Data Structure

- **Optimized Affirmations Storage**  
  ⮕ Migrated from redundant `{id: number, text: string}` objects to simplified `string[]` format, using array indices as identifiers.
  ⮕ add `affirmations: { type: [String], default: [] }` to UserModal to record affirmations.
- **UserModal bug fix**
  ⮕ Switch from bcrypt to bcryptjs。`import bcrypt from "bcryptjs"`,The bcrypt package can be quite strict regarding Node.js version compatibility - versions that are either too old or too new may impact its usability. To ensure broader compatibility, we're substituting it with the bcryptjs package instead


#### API & State Management

- **Persistence Layer**  
  ⮕ Implemented APIs to synchronize user-added/removed content with database.

#### UI/UX Enhancements

- **Dynamic Scaling**  
  ⮕ Added viewport size monitoring for text content with automatic `transform` adjustments.  
  ⮕ Customized Previous/Next navigation buttons for carousel.

#### Code Quality

- **Modal Component Upgrade**  
  ⮕ Refactored modal workflow to use `Modal.open()` method, eliminating DOM injection and simplifying usage.
