import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/library/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/library/lib/utils";
import { useNavState } from "@/library/components/menu-bar/NavStateContext";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isOverlay, isScrolled } = useNavState();

  // Determine if we are in the "Home Hero" state (Home + Overlay + Not Scrolled)
  // In this state, the background is always dark, so we force dark mode behavior/looks
  const isDarkLocked = isOverlay && !isScrolled;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 text-muted-foreground", className)}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors",
        // When locked on hero, force white text. Otherwise standard behavior.
        isDarkLocked
          ? "text-white hover:text-white/80"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      title={isDarkLocked ? "Dark Mode Required" : "Toggle Theme"}
    >
      {/* Sun Icon: Visible in Light Mode (and NOT locked) */}
      <Sun
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-transform",
          theme === "dark"
            ? "rotate-[-90deg] scale-0"
            : "rotate-0 scale-100",
        )}
      />
      {/* Moon Icon: Visible in Dark Mode (OR locked) */}
      <Moon
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] transition-transform",
          theme === "dark"
            ? "rotate-0 scale-100"
            : "rotate-90 scale-0",
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
