import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, MapPin, Smartphone, Fingerprint, ShieldAlert, ShieldCheck, Check } from 'lucide-react';
import { TrustFactors } from '../types/auth';

interface AnalysisOverlayProps {
  factors: TrustFactors;
  trustScore: number;
  onComplete: () => void;
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ factors, trustScore, onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),  // Context Check
      setTimeout(() => setStage(2), 1400), // Biometric Check
      setTimeout(() => setStage(3), 2200), // Final Decision
      setTimeout(() => onComplete(), 2800) // Proceed
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const Item = ({ 
    active, 
    completed, 
    icon: Icon, 
    label, 
    status, 
    isRisk 
  }: { 
    active: boolean; 
    completed: boolean; 
    icon: any; 
    label: string; 
    status: string;
    isRisk?: boolean;
  }) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: active || completed ? 1 : 0.3, x: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
        active ? 'bg-blue-50 border-blue-200' : 
        completed ? (isRisk ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200') : 
        'bg-slate-50 border-slate-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        active ? 'bg-blue-100 text-blue-600 animate-pulse' : 
        completed ? (isRisk ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600') : 
        'bg-slate-200 text-slate-400'
      }`}>
        {completed ? (isRisk ? <ShieldAlert className="w-5 h-5" /> : <Check className="w-5 h-5" />) : <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        <div className={`text-xs ${
          active ? 'text-blue-600' : 
          completed ? (isRisk ? 'text-rose-600' : 'text-emerald-600') : 
          'text-slate-400'
        }`}>
          {active ? 'Analyzing...' : (completed ? status : 'Pending')}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 mx-auto mb-4 flex items-center justify-center"
        >
          <Scan className="w-6 h-6 text-blue-600" />
        </motion.div>
        <h2 className="text-xl font-bold text-slate-900">Adaptive Security Scan</h2>
        <p className="text-sm text-slate-500">Verifying trust signals in real-time...</p>
      </div>

      <div className="space-y-3">
        <Item 
          active={stage === 0} 
          completed={stage > 0} 
          icon={Smartphone} 
          label="Device & Location Context" 
          status={factors.isKnownDevice && factors.isKnownLocation ? "Trusted Environment" : "Suspicious Context Detected"}
          isRisk={!factors.isKnownDevice || !factors.isKnownLocation}
        />
        
        <Item 
          active={stage === 1} 
          completed={stage > 1} 
          icon={Fingerprint} 
          label="Typing Biometrics (DNA)" 
          status={`${factors.typingConsistency}% Consistency Match`}
          isRisk={factors.typingConsistency < 70}
        />

        <Item 
          active={stage === 2} 
          completed={stage > 2} 
          icon={ShieldCheck} 
          label="Trust Score Calculation" 
          status={`Score: ${trustScore}/100 - ${trustScore >= 70 ? 'Access Approved' : 'Challenge Required'}`}
          isRisk={trustScore < 70}
        />
      </div>
    </div>
  );
};
