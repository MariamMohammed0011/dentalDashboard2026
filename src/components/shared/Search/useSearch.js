import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * Custom hook to manage search input state and logic with Fuse.js filtering.
 * 
 * @param {Array} data - The array of data to filter.
 * @param {Array} keys - The keys in the data objects to search within.
 * @param {Object} [options={}] - Additional Fuse.js options.
 * @returns {Object} - Search query, filtered data, and handlers.
 */
export const useSearch = (data = [], keys = [], options = {}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const rawData = data || [];
    
    // If no search query, return full data
    if (!searchQuery || !rawData.length) return rawData;

    const fuse = new Fuse(rawData, {
      keys,
      threshold: 0.5,
      useExtendedSearch: true,
      ignoreLocation: true,
      findAllMatches: true,
      distance: 100,
      ...options
    });

    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [data, searchQuery, JSON.stringify(keys), JSON.stringify(options)]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    handleSearchChange: (value) => setSearchQuery(value),
    clearSearch: () => setSearchQuery(''),
  };
};
