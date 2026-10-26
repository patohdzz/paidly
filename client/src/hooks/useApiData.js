import { useCallback, useEffect, useState } from "react";

// Loads data from the API when a page opens.
// `loader` must be stable: define it outside the component or wrap it in useCallback.
// Returns { data, setData, loading, error, reload }.
export function useApiData(loader) {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({
    loader: null,
    key: -1,
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    loader(controller.signal).then(
      (data) => setResult({ loader, key: reloadKey, data, error: null }),
      (error) => {
        // Ignore requests we cancelled because the page changed.
        if (error.name !== "AbortError") {
          setResult({ loader, key: reloadKey, data: null, error });
        }
      }
    );

    return () => controller.abort();
  }, [loader, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const setData = useCallback((update) => {
    setResult((prev) => ({
      ...prev,
      data: typeof update === "function" ? update(prev.data) : update,
    }));
  }, []);

  const loading = result.loader !== loader || result.key !== reloadKey;

  return {
    data: loading ? null : result.data,
    setData,
    loading,
    error: loading ? null : result.error,
    reload,
  };
}