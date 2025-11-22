import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Smartphone, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ChallengeModalProps {
  onVerify: () => void;
  trustScore: number;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({ onVerify, trustScore }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pushStatus, setPushStatus] = useState<'sending' | 'sent' | 'approved'>('sending');

  // Simulate Push Notification Lifecycle
  useEffect(() => {
    const timer1 = setTimeout(() => setPushStatus('sent'), 1500);
    return () => clearTimeout(timer1);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
    
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerify();
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
    >
      {/* Header: Explains WHY the user is here */}
      <div className="bg-rose-50 p-6 border-b border-rose-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Unusual Activity Detected</h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-rose-200 mt-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-rose-700">TRUST SCORE: {trustScore}/100</span>
        </div>
        <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto">
          Your login context (Location/Device) does not match your established profile.
        </p>
      </div>
      
      <div className="p-6 space-y-8">
        
        {/* Method 1: App Approval (Push) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
            {pushStatus === 'sending' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
             pushStatus === 'sent' ? <Smartphone className="w-5 h-5 text-blue-600 animate-pulse" /> :
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900">Device Approval</div>
            <div className="text-xs text-slate-500">
              {pushStatus === 'sending' ? 'Contacting secure device...' : 
               pushStatus === 'sent' ? 'Tap "Yes" on your iPhone 14 Pro' : 
               'Approved'}
            </div>
          </div>
          {pushStatus === 'sent' && (
            <button className="text-xs text-blue-600 font-medium hover:underline">Resend</button>
          )}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Or enter code</span>
        </div>

        {/* Method 2: OTP */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {otp.map((data, index) => (
              <input
                className="w-10 h-12 border-2 border-slate-200 rounded-lg text-center text-xl font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800 bg-white"
                type="text"
                maxLength={1}
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.some(d => d === '')}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Code...
              </>
            ) : (
              "Verify Identity"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
