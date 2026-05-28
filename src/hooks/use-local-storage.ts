import { useState, useCallback } from 'react'

type SetStateAction<T> = T | ((prev: T) => T)

export function useLocalStorage<T>(key: string, initialValue: T): [T, (action: SetStateAction<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (action: SetStateAction<T>) => {
      setStoredValue((prev) => {
        const next = typeof action === 'function' ? (action as (prev: T) => T)(prev) : action
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore write errors (e.g. private browsing quota)
        }
        return next
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
