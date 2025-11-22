export interface TypingMetric {
  char: string;
  dwellTime: number; // Time key was pressed down
  flightTime: number; // Time between previous key up and current key down
  timestamp: number;
}

export interface TrustFactors {
  isKnownDevice: boolean;
  isKnownLocation: boolean;
  isVpnDetected: boolean;
  typingConsistency: number; // 0 to 100
}

export type AuthStep = 'login' | 'analyzing' | 'challenge' | 'success';
