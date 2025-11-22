import { useState, useRef, useCallback } from 'react';
import { TypingMetric } from '../types/auth';

export function useTypingDna() {
  const [metrics, setMetrics] = useState<TypingMetric[]>([]);
  const lastKeyUpTime = useRef<number | null>(null);
  const keyDownTime = useRef<number | null>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    keyDownTime.current = performance.now();
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    const currentKeyUpTime = performance.now();
    
    if (keyDownTime.current) {
      const dwellTime = currentKeyUpTime - keyDownTime.current;
      const flightTime = lastKeyUpTime.current 
        ? keyDownTime.current - lastKeyUpTime.current 
        : 0;

      const newMetric: TypingMetric = {
        char: e.key,
        dwellTime,
        flightTime: Math.max(0, flightTime), // Prevent negative flight times on fast typing
        timestamp: currentKeyUpTime
      };

      setMetrics(prev => [...prev.slice(-19), newMetric]); // Keep last 20 keystrokes
    }

    lastKeyUpTime.current = currentKeyUpTime;
  }, []);

  const resetMetrics = () => setMetrics([]);

  // Calculate a simple "consistency" score based on variance of flight times
  // In a real app, this would compare against a stored user profile
  const calculateConsistency = () => {
    if (metrics.length < 5) return 100; // Not enough data yet
    
    const flightTimes = metrics.map(m => m.flightTime);
    const mean = flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length;
    const variance = flightTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / flightTimes.length;
    const stdDev = Math.sqrt(variance);
    
    // Arbitrary calculation for demo: Lower variance = Higher consistency
    // If stdDev is > 100ms, consistency drops
    const consistency = Math.max(0, 100 - (stdDev / 2));
    return Math.round(consistency);
  };

  return {
    metrics,
    handleKeyDown,
    handleKeyUp,
    resetMetrics,
    consistencyScore: calculateConsistency()
  };
}
