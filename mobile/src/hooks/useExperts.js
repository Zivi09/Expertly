import { useCallback, useEffect, useState } from 'react';
import { expertsApi } from '../services/api';

export function useExperts() {
  const [category, setCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [experts, setExperts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (nextPage, append) => {
      const isFirst = !append;
      if (isFirst) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const { data } = await expertsApi.list({
          page: nextPage,
          limit: 10,
          category: category === 'All' ? undefined : category,
          search: searchQuery.trim() || undefined,
        });
        setTotalPages(data.totalPages || 0);
        setTotal(data.total ?? 0);
        setExperts((prev) =>
          append ? [...prev, ...(data.experts || [])] : data.experts || []
        );
      } catch (e) {
        const msg =
          e.response?.data?.error ||
          e.message ||
          'Could not load experts. Please try again.';
        setError(msg);
        if (!append) setExperts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, searchQuery]
  );

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
    fetchPage(1, false);
  }, [category, searchQuery, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || error) return;
    if (page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next, true);
  }, [loading, loadingMore, error, page, totalPages, fetchPage]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  return {
    experts,
    category,
    setCategory,
    searchInput,
    setSearchInput,
    searchQuery,
    page,
    totalPages,
    total,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
  };
}
