import { INITIAL_ITEMS } from '../data/initialItems';
import { ClaimSubmission, Item, ItemStatus } from '../types';

const STORAGE_KEY = 'campus_lost_found_items_v4';
const CLAIMS_KEY = 'campus_lost_found_claims_v4';

// Check if Supabase env vars exist
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

function getLocalItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading localStorage, using initial dataset', e);
    return INITIAL_ITEMS;
  }
}

function saveLocalItems(items: Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed saving to localStorage', e);
  }
}

export async function fetchItems(): Promise<Item[]> {
  // If Supabase is configured, attempt fetch; fallback cleanly if offline or table uninitialized
  if (HAS_SUPABASE) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/items?select=*`, {
        headers: {
          apikey: SUPABASE_KEY!,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local persistent store', err);
    }
  }

  // Local persistent storage
  return getLocalItems();
}

export async function fetchItemById(id: string): Promise<Item | null> {
  const items = await fetchItems();
  return items.find((i) => i.id === id) || null;
}

export async function createItem(item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> {
  const newItem: Item = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  if (HAS_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY!,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const [saved] = await res.json();
        if (saved) return saved;
      }
    } catch (e) {
      console.warn('Supabase create failed, saving locally', e);
    }
  }

  const items = getLocalItems();
  const updated = [newItem, ...items];
  saveLocalItems(updated);
  return newItem;
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<Item | null> {
  if (HAS_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/items?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY!,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ status, updatedAt: new Date().toISOString() }),
      });
      if (res.ok) {
        const [updated] = await res.json();
        if (updated) return updated;
      }
    } catch (e) {
      console.warn('Supabase update failed, updating locally', e);
    }
  }

  const items = getLocalItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  saveLocalItems(items);
  return items[index];
}

export async function submitClaim(claim: Omit<ClaimSubmission, 'id' | 'submittedAt'>): Promise<ClaimSubmission> {
  const newClaim: ClaimSubmission = {
    ...claim,
    id: `claim-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    const claims = raw ? JSON.parse(raw) : [];
    claims.unshift(newClaim);
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  } catch (e) {
    console.error('Error saving claim', e);
  }

  return newClaim;
}

export function resetToDefaults(): Item[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  return INITIAL_ITEMS;
}
