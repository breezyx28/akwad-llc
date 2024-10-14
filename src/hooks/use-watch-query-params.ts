import { useEffect, useState } from 'react';

// Custom hook to return 'start_date' and 'end_date' from the URL query params
const useWatchQueryParams = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleQueryChange = () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Get 'start_date' and 'end_date' from query params
    const newStartDate = urlParams.get('start_date');
    const newEndDate = urlParams.get('end_date');

    // Update state with the new values
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  useEffect(() => {
    // Initialize: check the query params when the component mounts
    handleQueryChange();

    // Listen for changes in the URL (back/forward navigation or programmatic changes)
    const handlePopState = () => {
      handleQueryChange();
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Return an object containing 'start_date' and 'end_date'
  return {
    start_date: startDate,
    end_date: endDate,
  };
};

export default useWatchQueryParams;
