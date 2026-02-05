import { useEffect, useState } from "react";

/**
 * Simple debounced value hook used for search inputs etc.
 * Helps avoid duplicate / rapid fetch calls.
 */
export default function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

