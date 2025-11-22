import { TypingMetric } from '../types/auth';

// 1. Define Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'auditor' | 'judge';
  department?: string;
}

interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  requiresChallenge?: boolean;
}

// 2. Hardcoded "Database" - Expanded for Presentation
const MOCK_USERS: Record<string, string> = {
  'demo@dualite.dev': 'ZeroTrust2025!',
  'admin@secure.com': 'AdminPass123!',
  'judge@hackathon.com': 'Winner2025!',
  'sarah@design.co': 'PixelPerfect!',
  'dev@ops.net': 'DeployToProd!',
  'ceo@corp.com': 'MoneyMakesMoney$'
};

const USER_PROFILES: Record<string, UserProfile> = {
  'demo@dualite.dev': {
    id: 'u_001',
    email: 'demo@dualite.dev',
    name: 'Alex Chen',
    role: 'user',
    department: 'Engineering'
  },
  'admin@secure.com': {
    id: 'u_admin',
    email: 'admin@secure.com',
    name: 'Sarah Connor',
    role: 'admin',
    department: 'Security Ops'
  },
  'judge@hackathon.com': {
    id: 'u_judge',
    email: 'judge@hackathon.com',
    name: 'Honorable Judge',
    role: 'judge',
    department: 'Evaluation Committee'
  },
  'sarah@design.co': {
    id: 'u_003',
    email: 'sarah@design.co',
    name: 'Sarah Miller',
    role: 'user',
    department: 'Product Design'
  },
  'dev@ops.net': {
    id: 'u_004',
    email: 'dev@ops.net',
    name: 'David Ops',
    role: 'user',
    department: 'Infrastructure'
  },
  'ceo@corp.com': {
    id: 'u_005',
    email: 'ceo@corp.com',
    name: 'Mr. Big',
    role: 'admin',
    department: 'Executive'
  }
};

// 3. Backend Logic
export const mockBackend = {
  /**
   * Simulates a login request.
   * Checks credentials AND enforces minimum data requirements for security analysis.
   */
  login: async (email: string, pass: string, typingMetrics: TypingMetric[]): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1. Input Validation (The "Fixed Inputs" Requirement)
        if (!email || !pass) {
          resolve({ success: false, error: 'Credentials required' });
          return;
        }

        // 2. Security Policy: Minimum Password Length for Biometrics
        // We need at least 8 keystrokes to generate a reliable typing pattern
        if (pass.length < 8) {
          resolve({ success: false, error: 'Password too short for biometric analysis (min 8 chars)' });
          return;
        }

        // 3. Credential Check
        const storedPass = MOCK_USERS[email];
        if (storedPass && storedPass === pass) {
          resolve({ 
            success: true, 
            user: USER_PROFILES[email] 
          });
        } else {
          resolve({ success: false, error: 'Invalid email or password' });
        }
      }, 800); // Slightly faster for demo purposes
    });
  },

  verifyOtp: async (code: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(code === '123456'); // Hardcoded OTP for demo
      }, 1000);
    });
  }
};
