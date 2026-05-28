import { useState, useEffect } from 'react';

interface StaffAuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
  triggerToast: (msg: string, icon?: string) => void;
}

export default function StaffAuthModal({ onSuccess, onClose, triggerToast }: StaffAuthModalProps) {
  const [pin, setPin] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const correctPin = '2580'; // Sleek corporate numeric staff PIN

  // Hook-up keypress listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          setPin((prev) => prev + e.key);
        }
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleVerify();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pin]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleVerify = () => {
    if (pin === correctPin) {
      triggerToast('Staff authentication verified successfully!', 'verified_user');
      onSuccess();
    } else {
      setPin('');
      setErrorCount((prev) => prev + 1);
      triggerToast('Incorrect Staff Security PIN. Access Denied.', 'gpp_bad');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative shadow-2xl space-y-6 text-center"
        id="staff-auth-panel"
      >
        {/* Dynamic decorative backdrop effect */}
        <div className="absolute -inset-10 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">shield_lock</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">
              Security Protocol
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Brand identity header */}
        <div className="space-y-1 text-center relative z-10 pt-2">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-white text-2xl font-light">
              admin_panel_settings
            </span>
          </div>
          <h3 className="font-serif text-2xl text-white font-light italic">Staff Terminal</h3>
          <p className="text-[10px] font-sans text-on-surface-variant tracking-[0.25em] uppercase">
            Manager Authorization Keypad
          </p>
        </div>

        {/* PIN feedback indicator dots */}
        <div className="flex justify-center gap-4 py-2 relative z-10">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4.5 h-4.5 rounded-full border transition-all duration-300 ${
                  isFilled
                    ? 'bg-white border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-transparent border-white/20'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad Grid layout */}
        <div className="grid grid-cols-3 gap-3 relative z-10 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-18 h-12 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] active:scale-95 transition-all text-white font-serif text-lg flex items-center justify-center cursor-pointer font-light"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="w-18 h-12 rounded-xl bg-red-950/25 border border-red-900/10 hover:bg-red-950/40 text-[10px] uppercase font-sans font-bold tracking-widest text-red-300 flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="w-18 h-12 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] active:scale-95 transition-all text-white font-serif text-lg flex items-center justify-center cursor-pointer font-light"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-18 h-12 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">backspace</span>
          </button>
        </div>

        {/* Action Validation triggers */}
        <div className="space-y-4 pt-2 relative z-10">
          <button
            onClick={handleVerify}
            disabled={pin.length < 4}
            className={`w-full py-3.5 rounded-xl font-sans font-semibold text-xs tracking-[0.25em] uppercase transition-all ${
              pin.length === 4
                ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-lg shadow-white/5'
                : 'bg-white/5 text-white/35 cursor-not-allowed border border-white/5'
            }`}
          >
            Verify credentials
          </button>

          {/* Secure Hint Helper box for simulation */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-[10px] space-y-1 text-on-surface-variant flex items-center gap-2 justify-center leading-normal">
            <span className="material-symbols-outlined text-sm font-light text-white/40">info</span>
            <span>Staff access key for showcase: <strong className="text-white font-mono">2580</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
