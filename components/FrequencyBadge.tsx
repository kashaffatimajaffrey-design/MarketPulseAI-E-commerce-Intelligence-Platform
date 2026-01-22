
import React from 'react';
import { Frequency } from '../types';

interface FrequencyBadgeProps {
  frequency: Frequency;
}

const FrequencyBadge: React.FC<FrequencyBadgeProps> = ({ frequency }) => {
  const getColors = () => {
    switch (frequency.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColors()}`}>
      {frequency}
    </span>
  );
};

export default FrequencyBadge;
