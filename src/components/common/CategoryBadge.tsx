import React from 'react';
import { useExpenseWise } from '../../context/ExpenseContext';

interface CategoryBadgeProps {
  categoryName: string;
  className?: string;
  showDot?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoryName,
  className = '',
  showDot = true,
}) => {
  const { state } = useExpenseWise();
  const categoryObj = state.categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );
  const color = categoryObj?.color || '#10B981';

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 ${className}`}>
      {showDot && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{categoryName}</span>
    </span>
  );
};
