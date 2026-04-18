import { useEffect } from 'react'

export function useAutoScroll({ bottomRef, dependencies, open, view }) {
  useEffect(() => {
    if (open && view === 'chat') {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, view, ...dependencies])
}
