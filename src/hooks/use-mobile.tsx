
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    checkIfMobile()
    
    // Set up event listener for screen resizing
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up event listener
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return !!isMobile
}

export function useBreakpoint(breakpoint: number) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }
    
    checkBreakpoint()
    window.addEventListener("resize", checkBreakpoint)
    
    return () => {
      window.removeEventListener("resize", checkBreakpoint)
    }
  }, [breakpoint])

  return !!isBelow
}
