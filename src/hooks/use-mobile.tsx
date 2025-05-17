
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Default to mobile for SSR
    if (typeof window === 'undefined') return true;
    return window.innerWidth < MOBILE_BREAKPOINT;
  })

  React.useEffect(() => {
    // Initial check
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
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
