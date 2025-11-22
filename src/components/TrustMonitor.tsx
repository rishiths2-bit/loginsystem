import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Smartphone, Globe, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { TrustFactors, TypingMetric } from '../types/auth';
import { cn } from '../lib/utils';

interface TrustMonitorProps {
  score: number;
  factors: TrustFactors;
  typingMetrics: TypingMetric[];
  onToggleFactor: (factor: keyof Omit<TrustFactors, 'typingConsistency'>) => void;
}

export const TrustMonitor: React.FC<TrustMonitorProps> = ({ 
  score, 
  factors, 
  typingMetrics,
  onToggleFactor 
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="h-full bg-slate-900 text-slate-200 p-6 flex flex-col gap-6 border-l border-slate-800 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Zero-Trust Monitor
        </h2>
        <div className="text-xs font-mono text-slate-500">LIVE ANALYSIS</div>
      </div>

      {/* Main Score Display */}
      <div className="relative flex flex-col items-center justify-center py-8 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("text-6xl font-bold font-mono tracking-tighter", getScoreColor(score))}
        >
          {score}
        </motion.div>
        <div className="text-sm text-slate-400 mt-2 font-medium">TRUST SCORE</div>
        
        {/* Progress Ring Background (Simplified) */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-10">
           <div className={cn("w-full h-1 absolute bottom-0", getScoreBg(score))} style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Environmental Factors Controls */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Environment Simulation</h3>
        
        <button 
          onClick={() => onToggleFactor('isKnownDevice')}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Smartphone className={cn("w-4 h-4", factors.isKnownDevice ? "text-emerald-400" : "text-rose-400")} />
            <span className="text-sm">Device Fingerprint</span>
          </div>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", 
            factors.isKnownDevice ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
            {factors.isKnownDevice ? "MATCH" : "UNKNOWN"}
          </span>
        </button>

        <button 
          onClick={() => onToggleFactor('isKnownLocation')}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <MapPin className={cn("w-4 h-4", factors.isKnownLocation ? "text-emerald-400" : "text-rose-400")} />
            <span className="text-sm">Geo-Location</span>
          </div>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", 
            factors.isKnownLocation ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
            {factors.isKnownLocation ? "HOME" : "NEW"}
          </span>
        </button>

        <button 
          onClick={() => onToggleFactor('isVpnDetected')}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Globe className={cn("w-4 h-4", !factors.isVpnDetected ? "text-emerald-400" : "text-amber-400")} />
            <span className="text-sm">Network Analysis</span>
          </div>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", 
            !factors.isVpnDetected ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>
            {factors.isVpnDetected ? "VPN DETECTED" : "SECURE"}
          </span>
        </button>
      </div>

      {/* Typing DNA Visualizer */}
      <div className="flex-1 min-h-[200px] flex flex-col">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between">
          <span>Typing Biometrics</span>
          <span className={cn(factors.typingConsistency > 80 ? "text-emerald-400" : "text-amber-400")}>
            {factors.typingConsistency}% Consistency
          </span>
        </h3>
        
        <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 gap-1">
            {typingMetrics.map((m, i) => (
              <motion.div
                key={m.timestamp}
                initial={{ height: 0 }}
                animate={{ height: Math.min(100, m.flightTime / 2) + '%' }}
                className="w-full bg-blue-500/40 rounded-t-sm relative group"
              >
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 px-1 rounded text-white whitespace-nowrap z-10">
                   {m.flightTime.toFixed(0)}ms
                 </div>
              </motion.div>
            ))}
            {typingMetrics.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm italic">
                Waiting for keystrokes...
              </div>
            )}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="w-full h-1/2 border-t border-dashed border-slate-800/50 mt-[25%]"></div>
             <div className="w-full h-1/2 border-t border-dashed border-slate-800/50 mt-[25%]"></div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Visualizing flight time (ms) between keystrokes. erratic patterns lower trust score.
        </p>
      </div>
    </div>
  );
};
