import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

const STORAGE_KEY = 'recent'
const MAX_ITEMS = 8

export function useRecentlyViewed() {
  const [ids, setIds] = useState(() => readStorage(STORAGE_KEY, []))

  useEffect(() => {
    writeStorage(STORAGE_KEY, ids)
  }, [ids])

  const track = useCallback((id) => {
    setIds((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, MAX_ITEMS))
  }, [])

  const clear = useCallback(() => setIds([]), [])

  return { ids, track, clear }
}