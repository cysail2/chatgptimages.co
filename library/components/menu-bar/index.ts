/**
 * Menu Bar Components
 * 
 * A macOS-style menu bar architecture for the webapp:
 * 
 * ```
 * MenuBar (Server Component - main entry point)
 * ├── ScrollAwareNav (Client - scroll-based styling)
 * │   ├── MenuBarNavigation (Client - logo + webapp menus/nav)
 * │   └── MenuBarControls (Client - composed from extras)
 * │       ├── AudioPlayerExtra
 * │       ├── TaskCenterExtra
 * │       ├── ThemeExtra
 * │       ├── UserBalanceExtra
 * │       ├── UserAuthExtra
 * │       └── TrialToastExtra
 * └── MobileBottomNav (Client - iOS-style bottom navigation)
 * ```
 */

// Main entry point (Server Component)
export { MenuBar } from "./MenuBar";

// Client Components
export { ScrollAwareNav } from "./ScrollAwareNav";
export { MenuBarNavigation } from "./MenuBarNavigation";
export { MenuBarExtras } from "./MenuBarExtras";
export { MobileBottomNav } from "./MobileBottomNav";

// Extra Items (for custom compositions)
export * from "./extras";
export * from "./NavbarConfigContext";

// Alias for backward compatibility
export { MenuBar as Navbar } from "./MenuBar";
