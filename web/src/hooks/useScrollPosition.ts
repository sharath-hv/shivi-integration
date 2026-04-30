import { useEffect, useState, useRef } from "react";

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
  scrollDirection: "up" | "down" | "none";
}

/**
 * Hook to track scroll direction and determine compact mode state
 * - Any scroll down triggers compact mode
 * - Any scroll up triggers full mode  
 * @param minScrollThreshold - Minimum scroll position to enable direction detection (default: 50)
 */
export function useScrollPosition(minScrollThreshold: number = 50): ScrollPosition {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");
  
  const lastScrollY = useRef(0);
  const lastDirectionChange = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const now = Date.now();
          
          // Only detect direction if we've scrolled past minimum threshold
          if (currentScrollY > minScrollThreshold) {
            const deltaY = currentScrollY - lastScrollY.current;
            
            // Ignore very small movements to prevent flickering
            if (Math.abs(deltaY) > 2) {
              const newDirection = deltaY > 0 ? "down" : "up";
              
              // Add small debounce (50ms) to prevent rapid toggling
              if (newDirection !== scrollDirection && now - lastDirectionChange.current > 50) {
                setScrollDirection(newDirection);
                setIsScrolled(newDirection === "down");
                lastDirectionChange.current = now;
              }
            }
          } else {
            // Below threshold - always show full mode
            setIsScrolled(false);
            setScrollDirection("none");
          }
          
          setScrollY(currentScrollY);
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [minScrollThreshold, scrollDirection]);

  return { scrollY, isScrolled, scrollDirection };
}