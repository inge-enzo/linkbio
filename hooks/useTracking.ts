import { useCallback } from 'react';

interface TrackingParams {
  userId: string;
}

export function useTracking({ userId }: TrackingParams) {
  const trackPageView = useCallback(async () => {
    try {
      await fetch('/api/analytics/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [userId]);

  const trackClick = useCallback(
    async (itemType: string, itemId: string) => {
      try {
        await fetch('/api/analytics/click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            itemType,
            itemId,
          }),
        });
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    },
    [userId]
  );

  const trackSearch = useCallback(
    async (query: string, type: string) => {
      try {
        await fetch('/api/analytics/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            query,
            type,
          }),
        });
      } catch (error) {
        console.error('Error tracking search:', error);
      }
    },
    [userId]
  );

  return {
    trackPageView,
    trackClick,
    trackSearch,
  };
}
