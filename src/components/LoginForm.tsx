import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Info, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useTypingDna } from '../hooks/useTypingDna';
import { mockBackend } from '../services/mockBackend';
import { TypingMetric } from '../types/auth';

interface LoginFormProps {
  onSubmitSuccess: () => void;
  onTypingUpdate: (metrics: TypingMetric[]) => void;
}

const DEMO_USERS = [
  { email: 'demo@dualite.dev', pass: 'ZeroTrust2025!', label: 'Standard User' },
  { email: 'judge@hackathon.com', pass: 'Winner2025!', label: 'Judge Access' },
  { email: 'admin@secure.com', pass: 'AdminPass123!', label: 'Admin' },
];

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmitSuccess, onTypingUpdate }) => {
  const [email, setEmail] = useState('demo@dualite.dev'); 
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  
  const { handleKeyDown, handleKeyUp, metrics } = useTypingDna();

  React.useEffect(() => {
    onTypingUpdate(metrics);
  }, [metrics, onTypingUpdate]);

  const fillCredentials = (u: typeof DEMO_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.pass); // Note: In a real app, we wouldn't auto-fill pass for security, but this is for demo speed
    setError(null);
    setShowUsers(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await mockBackend.login(email, password, metrics);

      if (response.success) {
        onSubmitSuccess();
      } else {
        setError(response.error || 'Authentication failed');
      }
    } catch (err) {
      setError('System error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
        <p className="text-slate-500 mt-2">Please enter your credentials to access the secure vault.</p>
      </div>

      {/* Enhanced Demo Credentials Selector */}
      <div className="mb-6 bg-blue-50 rounded-lg border border-blue-100 overflow-hidden transition-all">
        <button 
          onClick={() => setShowUsers(!showUsers)}
          className="w-full p-4 flex items-center justify-between text-blue-800 hover:bg-blue-100/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold">Available Demo Accounts</span>
          </div>
          {showUsers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {showUsers && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-blue-100"
            >
              <div className="p-2 space-y-1">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => fillCredentials(u)}
                    className="w-full text-left p-2 hover:bg-blue-100 rounded flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-blue-900">{u.label}</div>
                      <div className="text-xs text-blue-700 font-mono">{u.email}</div>
                    </div>
                    <div className="text-[10px] bg-white px-2 py-1 rounded border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                      Auto-fill
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white font-mono tracking-wider"
              placeholder="••••••••••••"
            />
          </div>
          <div className="flex justify-between items-center pt-1">
             <p className="text-[10px] text-slate-400">
               Min 8 chars required for analysis
             </p>
             <p className="text-[10px] text-emerald-600 font-medium">
               Typing biometrics active
             </p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-2 text-sm text-rose-600"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying Credentials...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
