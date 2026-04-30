import { useCallback, useEffect, useRef, useState } from "react";

export interface ScrollDirectionCompact {
  /** True when strip should show minimised layout */
  isCompact: boolean;
}

/**
 * Optimized scroll direction detection for ultra-smooth animations
 * Uses state consolidation and smart debouncing for lag-free performance
 */
export function useScrollDirectionCompact(
  downThresholdPx: number = 4,
): ScrollDirectionCompact {
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const lastUpdateTime = useRef(0);
  const animationFrame = useRef<number>();

  const updateCompactState = useCallback(() => {
    const now = performance.now();
    const y = window.scrollY;
    const delta = y - lastScrollY.current;
    const timeDelta = now - lastUpdateTime.current;
    
    // Calculate velocity to make transitions feel more responsive
    if (timeDelta > 0) {
      scrollVelocity.current = delta / timeDelta;
    }
    
    // More intelligent state changes based on velocity and direction
    const isScrollingDown = delta > 0;
    const isScrollingUp = delta < 0;
    const hasSignificantMovement = Math.abs(delta) >= downThresholdPx;
    const isFastScroll = Math.abs(scrollVelocity.current) > 0.5;
    
    if (isScrollingDown && (hasSignificantMovement || isFastScroll) && !isCompact) {
      setIsCompact(true);
    } else if (isScrollingUp && isCompact) {
      setIsCompact(false);
    }
    
    lastScrollY.current = y;
    lastUpdateTime.current = now;
  }, [downThresholdPx, isCompact]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastUpdateTime.current = performance.now();
    
    const handleScroll = () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      animationFrame.current = requestAnimationFrame(updateCompactState);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [updateCompactState]);

  return { isCompact };
}
