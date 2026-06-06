import React from 'react';
import { getGradeColor } from '../../utils/formatting';

const Badge = ({ children, variant = 'default', grade = null }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const className =
    variant === 'grade' && grade
      ? getGradeColor(grade)
      : variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
