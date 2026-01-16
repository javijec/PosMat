import { useState, useMemo } from "react";

/**
 * Custom hook to handle multi-criteria filtering of items.
 * @param {Array} items - The list of items to filter.
 * @param {Object} initialFilters - Initial state for the filters.
 * @param {Function} filterFn - A function that takes (item, filters) and returns boolean.
 */
export const useFilters = (items, initialFilters, filterFn) => {
  const [filters, setFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => filterFn(item, filters));
  }, [items, filters, filterFn]);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(initialFilters);
  }, [filters, initialFilters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredData,
    hasActiveFilters,
  };
};
