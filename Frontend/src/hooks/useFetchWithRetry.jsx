import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic fetch hook with:
 * - loading / error state
 * - retry (default 2 extra attempts)
 * - timeout handling
 * - race-condition safe cancellation
 *
 * Backend contracts are NOT changed – you provide the fetchFn that calls existing APIs.
 */
export default function useFetchWithRetry({
  fetchFn,
  deps = [],
  immediate = true,
  maxRetries = 2,
  timeoutMs = 10000,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const attemptsRef = useRef(0);
  const abortRef = useRef(false);

  const runFetch = useCallback(async () => {
    if (!fetchFn) return;

    abortRef.current = false;
    attemptsRef.current = 0;
    setLoading(true);
    setError(null);

    const withTimeout = (promise) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Request timed out"));
        }, timeoutMs);

        promise
          .then((value) => {
            clearTimeout(timer);
            resolve(value);
          })
          .catch((err) => {
            clearTimeout(timer);
            reject(err);
          });
      });

    let lastError = null;

    while (attemptsRef.current <= maxRetries && !abortRef.current) {
      try {
        const result = await withTimeout(fetchFn());
        if (abortRef.current) return;
        setData(result);
        setLoading(false);
        setError(null);
        return;
      } catch (err) {
        lastError = err;
        attemptsRef.current += 1;
        if (attemptsRef.current > maxRetries) break;
      }
    }

    if (!abortRef.current) {
      setError(lastError || new Error("Something went wrong"));
      setLoading(false);
    }
  }, [fetchFn, maxRetries, timeoutMs]);

  useEffect(() => {
    if (!immediate) return;
    runFetch();

    return () => {
      abortRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // we intentionally depend on the caller-provided deps

  return {
    data,
    loading,
    error,
    refetch: runFetch,
  };
}

