import { createContext, useContext, useEffect, useState } from 'react';
import { products } from '../data/catalog';

const BagContext = createContext(null);
const storageKey = 'veriation-demo-bag';

function readBag() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(stored)) return [];
    const valid = [];
    for (const line of stored) {
      const item = products.find((item) => item.id === line?.productId);
      if (
        !item?.variants.some(
          (variant) => variant.id === line.variantId && variant.available,
        ) ||
        !Number.isSafeInteger(line.quantity) ||
        line.quantity < 1
      )
        continue;
      const existing = valid.find(
        (entry) =>
          entry.productId === line.productId &&
          entry.variantId === line.variantId,
      );
      if (existing)
        existing.quantity = Math.min(99, existing.quantity + line.quantity);
      else
        valid.push({
          productId: line.productId,
          variantId: line.variantId,
          quantity: Math.min(99, line.quantity),
        });
    }
    return valid;
  } catch {
    return [];
  }
}

export function BagProvider({ children }) {
  const [lines, setLines] = useState(readBag);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(lines));
    } catch {
      /* The bag still works when storage is unavailable. */
    }
  }, [lines]);

  function add(productId, variantId, quantity) {
    const item = products.find((item) => item.id === productId);
    if (
      !item?.variants.some(
        (variant) => variant.id === variantId && variant.available,
      ) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    )
      return;
    setLines((current) => {
      const existing = current.find(
        (line) => line.productId === productId && line.variantId === variantId,
      );
      return existing
        ? current.map((line) =>
            line === existing
              ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
              : line,
          )
        : [
            ...current,
            { productId, variantId, quantity: Math.min(99, quantity) },
          ];
    });
  }

  function update(variantId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
    setLines((current) =>
      current.map((line) =>
        line.variantId === variantId ? { ...line, quantity } : line,
      ),
    );
  }

  const remove = (variantId) =>
    setLines((current) =>
      current.filter((line) => line.variantId !== variantId),
    );
  const items = lines.map((line) => ({
    ...line,
    product: products.find((item) => item.id === line.productId),
    unitPrice: products.find((item) => item.id === line.productId).variants.find(v => v.id === line.variantId).price,
  }));
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = items.reduce(
    (total, line) => total + line.unitPrice * line.quantity,
    0,
  );

  return (
    <BagContext.Provider
      value={{ items, count, subtotal, add, update, remove }}
    >
      {children}
    </BagContext.Provider>
  );
}

export const useBag = () => useContext(BagContext);

