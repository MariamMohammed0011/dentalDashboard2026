import React, { useEffect, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * AnimatedNumber Component
 * Animates a numeric value from 0 (or previous value) to target value smoothly.
 * Supports prefix (e.g. '$'), suffix (e.g. '%'), and decimal control.
 */
const AnimatedNumber = ({
  value = 0,
  duration = 1,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    motionValue.set(numericValue);
  }, [numericValue, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      const formatted = latest.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      setDisplayValue(formatted);
    });
    return () => unsubscribe();
  }, [springValue, decimals]);

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
