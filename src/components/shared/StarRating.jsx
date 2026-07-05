import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 16 }) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(
        <Star key={i} size={size} fill="#F59E0B" className="text-amber-500" />
      );
    } else if (i - 0.5 === roundedRating) {
      stars.push(
        <div key={i} className="relative inline-block" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-200 dark:text-slate-700 pointer-events-none" />
          <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pointer-events-none" style={{ width: '50%' }}>
            <Star size={size} fill="#F59E0B" className="text-amber-500" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-gray-200 dark:text-slate-700" />
      );
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

export default StarRating;
