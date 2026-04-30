import { useEffect, useState } from "react";

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
}

/**
 * Hook to track scroll position and determine if user has scrolled past threshold
 * @param threshold - Scroll threshold in pixels (default: 100)
 */
export function useScrollPosition(threshold: number = 100): ScrollPosition {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);
          setIsScrolled(currentScrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrollY, isScrolled };
}