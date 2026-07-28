"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { ORDER_EVENT, ORDER_STORAGE_KEY } from "@/lib/constants";
import { countOrderLines, parseOrderLines } from "@/lib/functions/functions";
import type {
  OrderContextValue,
  OrderLines,
  ProvidersProps,
} from "@/types/types";

const EMPTY_LINES: OrderLines = {};

let cachedRaw: string | null = null;
let cachedLines: OrderLines = EMPTY_LINES;

const OrderContext = createContext<OrderContextValue | null>(null);

function readLines(): OrderLines {
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedLines = parseOrderLines(raw);
    }
  } catch {
    return EMPTY_LINES;
  }
  return cachedLines;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(ORDER_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ORDER_EVENT, onChange);
  };
}

export function Providers({ children }: ProvidersProps) {
  const lines = useSyncExternalStore(subscribe, readLines, () => EMPTY_LINES);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const addToOrder = useCallback((productId: number, stock: number) => {
    const current = readLines();
    const ordered = current[productId] ?? 0;
    if (stock <= 0 || ordered >= stock) return;

    try {
      window.localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify({ ...current, [productId]: ordered + 1 }),
      );
    } catch {
      return;
    }
    window.dispatchEvent(new Event(ORDER_EVENT));
  }, []);

  const resetOrder = useCallback(() => {
    try {
      window.localStorage.removeItem(ORDER_STORAGE_KEY);
    } catch {
      return;
    }
    window.dispatchEvent(new Event(ORDER_EVENT));
  }, []);

  const count = useMemo(() => countOrderLines(lines), [lines]);

  const value = useMemo(
    () => ({ lines, count, ready, addToOrder, resetOrder }),
    [lines, count, ready, addToOrder, resetOrder],
  );

  return <OrderContext value={value}>{children}</OrderContext>;
}

export function useOrder(): OrderContextValue {
  const value = useContext(OrderContext);
  if (!value) {
    throw new Error("useOrder must be used inside Providers");
  }
  return value;
}
