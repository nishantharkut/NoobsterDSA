
import * as React from "react"

// Defined breakpoints for consistent use across app
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
}

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses a debounced resize event for performance
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Default to mobile for SSR
    if (typeof window === 'undefined') return true;
    return window.innerWidth < BREAKPOINTS.MOBILE;
  })

  React.useEffect(() => {
    // Initial check
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    checkIfMobile()
    
    // Set up event listener for screen resizing with debounce
    let timeoutId: number | null = null;
    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(checkIfMobile, 100);
    };
    
    window.addEventListener("resize", handleResize)
    
    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }, [])

  return isMobile
}

/**
 * Hook to check if viewport is below a specific breakpoint
 * @param breakpoint - Width in pixels to check against
 */
export function useBreakpoint(breakpoint: number) {
  const [isBelow, setIsBelow] = React.useState<boolean>(() => {
    // Default to below for SSR
    if (typeof window === 'undefined') return true;
    return window.innerWidth < breakpoint;
  })

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }
    
    checkBreakpoint()
    
    // Debounced event listener
    let timeoutId: number | null = null;
    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(checkBreakpoint, 100);
    };
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }, [breakpoint])

  return isBelow
}

/**
 * Hook that provides multiple breakpoints at once for responsive design
 * @returns Object containing boolean values for different breakpoints
 */
export function useResponsive() {
  const isMobile = useBreakpoint(BREAKPOINTS.MOBILE);
  const isTablet = useBreakpoint(BREAKPOINTS.TABLET);
  const isDesktop = useBreakpoint(BREAKPOINTS.DESKTOP);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    // Corrected logic for these derived values
    isTabletOnly: !isMobile && isTablet,
    isDesktopAndAbove: !isDesktop
  };
}
