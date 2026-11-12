import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/** Stable subscription to the matchMedia change event. */
const subscribe = (onStoreChange: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

export function useIsMobile() {
  // useSyncExternalStore replaces the old setState-in-effect pattern
  // (same behavior: false on the server, live value on the client).
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
