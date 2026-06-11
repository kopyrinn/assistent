import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'consai-favorite-listings';

interface FavoritesApi {
  favoriteIds: Set<string>;
  count: number;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesApi | null>(null);

function readStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readStoredFavorites);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const toggleFavorite = useCallback((id: string) => {
    setIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  }, []);

  const favoriteIds = useMemo(() => new Set(ids), [ids]);
  const value = useMemo<FavoritesApi>(
    () => ({
      favoriteIds,
      count: favoriteIds.size,
      isFavorite: (id) => favoriteIds.has(id),
      toggleFavorite,
    }),
    [favoriteIds, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesApi {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider');
  return context;
}
