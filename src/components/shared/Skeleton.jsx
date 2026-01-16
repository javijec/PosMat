import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * A shared Skeleton wrapper to ensure consistent styling across the app.
 * By default it uses a light gray theme that fits the Indigo/White aesthetic.
 */
const AppSkeleton = ({ children, ...props }) => {
  return (
    <SkeletonTheme
      baseColor="var(--bg-skeleton)"
      highlightColor="var(--highlight-skeleton)"
    >
      <Skeleton {...props} />
    </SkeletonTheme>
  );
};

export const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg w-1/3 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded w-1/4"></div>
          <div className="h-11 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] shadow-sm"></div>
        </div>
      ))}
    </div>
    <div className="flex justify-end space-x-3 pt-6">
      <div className="h-10 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl w-24"></div>
      <div className="h-10 bg-ingenieria rounded-xl w-32 opacity-20"></div>
    </div>
  </div>
);

export const ListSkeleton = ({ items = 3 }) => (
  <div className="grid gap-6">
    {[...Array(items)].map((_, i) => (
      <div
        key={i}
        className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between shadow-sm animate-pulse"
      >
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-[var(--bg-surface)] rounded-lg w-1/3"></div>
          <div className="h-4 bg-[var(--bg-surface)]/60 rounded-md w-1/2"></div>
          <div className="h-4 bg-[var(--bg-surface)]/40 rounded-md w-1/4"></div>
        </div>
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-[var(--bg-surface)] rounded-xl"></div>
          <div className="w-10 h-10 bg-[var(--bg-surface)] rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
);

export default AppSkeleton;
