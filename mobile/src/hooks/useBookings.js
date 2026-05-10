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

  const cancel = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      await bookingsApi.cancel(bookingId);
      // Remove from local state
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (e) {
      const msg = e.response?.data?.error || e.message || 'Failed to cancel booking.';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

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
    cancel,
  };
}
