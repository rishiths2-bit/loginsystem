import React, { useState, useCallback } from 'react';
import { TrustMonitor } from './components/TrustMonitor';
import { LoginForm } from './components/LoginForm';
import { ChallengeModal } from './components/ChallengeModal';
import { AnalysisOverlay } from './components/AnalysisOverlay';
import { TrustFactors, AuthStep, TypingMetric } from './types/auth';
import { ShieldCheck, CheckCircle2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [step, setStep] = useState<AuthStep>('login');
  const [typingMetrics, setTypingMetrics] = useState<TypingMetric[]>([]);
  
  // Simulation State
  const [factors, setFactors] = useState<TrustFactors>({
    isKnownDevice: true,
    isKnownLocation: true,
    isVpnDetected: false,
    typingConsistency: 100
  });

  // Calculate Trust Score
  const calculateScore = () => {
    let score = 100;
    if (!factors.isKnownDevice) score -= 30;
    if (!factors.isKnownLocation) score -= 30;
    if (factors.isVpnDetected) score -= 20;
    
    // Impact of typing consistency
    if (factors.typingConsistency < 70) score -= 20;
    
    return Math.max(0, score);
  };

  const trustScore = calculateScore();

  const handleTypingUpdate = useCallback((metrics: TypingMetric[]) => {
    setTypingMetrics(metrics);
    
    // Simple simulation: if typing is very erratic (high variance in flight times), lower consistency
    if (metrics.length > 5) {
      const flightTimes = metrics.map(m => m.flightTime);
      const sum = flightTimes.reduce((x, y) => x + y, 0);
      const mean = sum / flightTimes.length;
      const variance = flightTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / flightTimes.length;
      
      // Update consistency factor based on real typing
      setFactors(prev => ({
        ...prev,
        typingConsistency: Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / 5)))
      }));
    }
  }, []);

  // 1. First, validate credentials (Mock Backend)
  const handleLoginSuccess = useCallback(() => {
    // Instead of immediate success, we go to analysis phase to SHOW the judges the checks
    setStep('analyzing');
  }, []);

  // 2. After Analysis Animation completes, route based on Trust Score
  const handleAnalysisComplete = useCallback(() => {
    if (trustScore >= 70) {
      setStep('success');
    } else {
      setStep('challenge');
    }
  }, [trustScore]);

  const handleChallengeVerify = useCallback(() => {
    setStep('success');
  }, []);

  const resetFlow = useCallback(() => {
    setStep('login');
    setTypingMetrics([]);
    setFactors(prev => ({...prev, typingConsistency: 100}));
  }, []);

  const toggleFactor = useCallback((key: keyof Omit<TrustFactors, 'typingConsistency'>) => {
    setFactors(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans text-slate-900">
      
      {/* Left Panel: Main Interaction Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">ZeroTrust<span className="text-blue-600">Gate</span></span>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <AnimatePresence mode="wait">
            {step === 'login' && (
              <LoginForm 
                key="login"
                onSubmitSuccess={handleLoginSuccess} 
                onTypingUpdate={handleTypingUpdate}
              />
            )}

            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <AnalysisOverlay 
                  factors={factors}
                  trustScore={trustScore}
                  onComplete={handleAnalysisComplete}
                />
              </motion.div>
            )}

            {step === 'challenge' && (
              <ChallengeModal 
                key="challenge"
                trustScore={trustScore}
                onVerify={handleChallengeVerify}
              />
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Access Granted</h2>
                <p className="text-slate-500 mb-8">Identity verified successfully via adaptive protocols.</p>
                <button 
                  onClick={resetFlow}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset Demo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-6 text-center text-xs text-slate-400">
          &copy; 2025 ZeroTrust Gate. Adaptive Security Protocol.
        </div>
      </div>

      {/* Right Panel: Security Console (Desktop) */}
      <div className="hidden md:block w-96 h-screen sticky top-0 shadow-2xl shadow-slate-900/20 z-20">
        <TrustMonitor 
          score={trustScore} 
          factors={factors} 
          typingMetrics={typingMetrics}
          onToggleFactor={toggleFactor}
        />
      </div>

      {/* Mobile Toggle for Console (Simplified) */}
      <div className="md:hidden bg-slate-900 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold">Trust Score: {trustScore}</span>
          <span className={trustScore >= 70 ? "text-emerald-400" : "text-rose-400"}>
            {trustScore >= 70 ? "Safe" : "Risk"}
          </span>
        </div>
      </div>

    </div>
  );
}

export default App;
