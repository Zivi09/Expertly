import { useCallback, useState } from 'react';
import { bookingsApi } from '../services/api';

export function useBookings() {
  const [emailInput, setEmailInput] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (address) => {
    const trimmed = String(address ?? '').trim();
    if (!trimmed) {
      setError('Please enter an email address.');
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    setLastQuery(trimmed);
    try {
      const { data } = await bookingsApi.byEmail(trimmed.toLowerCase());
      setBookings(data.bookings || []);
    } catch (e) {
      const msg =
        e.response?.data?.error ||
        e.message ||
        'Could not load bookings.';
      setError(msg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (lastQuery) search(lastQuery);
  }, [lastQuery, search]);

  return {
    emailInput,
    setEmailInput,
    lastQuery,
    bookings,
    loading,
    error,
    searched,
    search,
    retry,
  };
}
