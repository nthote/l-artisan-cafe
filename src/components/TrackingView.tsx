import { useState, useEffect } from 'react';
import { Order } from '../types';

interface TrackingViewProps {
  order: Order | null;
  onBackToMenu: () => void;
  onOpenFeedback: () => void;
  onSummonWaiterTarget: (tableNum: number) => void;
  onGoToRewards: () => void;
}

export default function TrackingView({
  order,
  onBackToMenu,
  onOpenFeedback,
  onSummonWaiterTarget,
  onGoToRewards,
}: TrackingViewProps) {
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [localStatus, setLocalStatus] = useState<'Received' | 'Preparing' | 'Ready' | 'Served'>('Received');
  const [progressVal, setProgressVal] = useState(15);

  // Sync state or simulate status movement for client delight
  useEffect(() => {
    if (order) {
      setLocalStatus(order.status);
    }
  }, [order]);

  // Handle local state tracking progress bars based on simulated states
  const statusSteps = [
    { title: 'Received', label: 'Order Registered', value: 15, key: 'Received' },
    { title: 'Preparing', label: 'Baristas Styling', value: 50, key: 'Preparing' },
    { title: 'Ready', label: 'Aroma Complete', value: 80, key: 'Ready' },
    { title: 'Served', label: 'Presenting Blend', value: 100, key: 'Served' },
  ] as const;

  const activeIndex = statusSteps.findIndex((s) => s.key === localStatus);

  // Automatically update progress percentage based on step selection for visual polish
  useEffect(() => {
    const activeStep = statusSteps.find((s) => s.key === localStatus);
    if (activeStep) {
      setProgressVal(activeStep.value);
    }
  }, [localStatus]);

  if (!order) {
    return (
      <div className="w-full min-h-screen bg-background text-on-surface pt-32 pb-16 text-center px-6">
        <div className="max-w-md mx-auto space-y-4">
          <span className="material-symbols-outlined text-6xl text-outline-variant animate-pulse">
            receipt_long
          </span>
          <p className="font-sans text-[#d0c5af] text-sm">
            No active dining tracking session was identified.
          </p>
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold font-sans uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
          >
            sensory menu storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pt-24 pb-36 font-sans">
      
      {/* Header and Back Button */}
      <div className="max-w-4xl mx-auto px-6 mb-8 flex justify-between items-center select-none">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white font-bold text-xs tracking-wider uppercase bg-[#0c0c0c] px-4.5 py-2.5 rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Order More</span>
        </button>

        <div className="flex gap-2">
          {localStatus === 'Served' && (
            <button
              onClick={onOpenFeedback}
              className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-medium tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(255,255,255,0.05)] flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <span className="material-symbols-outlined text-sm">rate_review</span>
              <span>Rate Experience</span>
            </button>
          )}

          <button
            onClick={() => onSummonWaiterTarget(order.tableNumber)}
            className="flex items-center gap-1.5 text-white hover:text-black hover:bg-white border border-white/10 px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">concierge_bell</span>
            <span>Waiter</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-8 text-left">
        {/* Live Tracking Header Container */}
        <div className="bg-[#0c0c0c] rounded-2xl border border-white/10 p-6 space-y-4 shadow-md relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-44 h-44 aroma-glow pointer-events-none" />

          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#d0c5af]/50 uppercase tracking-widest block">
                Live Tracking Session
              </span>
              <h2 className="font-serif text-2xl text-on-surface">
                Preparing Your Blend...
              </h2>
            </div>
            
            <div className="bg-[#2a2a2a] px-3.5 py-1.5 rounded-lg border border-outline-variant/20 text-right font-mono text-xs select-none">
              <span className="text-on-surface-variant">Order Code: </span>
              <strong className="text-primary font-bold">{order.id}</strong>
            </div>
          </div>

          {/* Interactive timeline bar representation */}
          <div className="pt-8 pb-4 relative">
            
            {/* Horizontal tracking progress background gutter */}
            <div className="absolute top-[44px] left-8 right-8 h-1 bg-surface-container-high rounded-full z-0 overflow-hidden">
              <div
                className="h-full bg-primary shimmer-progress transition-all duration-700"
                style={{ width: `${progressVal}%` }}
              />
            </div>

            {/* Stepper nodes */}
            <div className="flex justify-between relative z-10 select-none">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isActive = idx === activeIndex;

                return (
                  <div key={idx} className="flex flex-col items-center max-w-[64px] text-center gap-2">
                    <button
                      onClick={() => {
                        // Let developers/auditors play with the simulation directly here too!
                        setLocalStatus(step.key);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs tracking-tight transition-all border shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white border-white text-black ring-4 ring-white/10 scale-110'
                          : isPassed
                          ? 'bg-[#0c0c0c] border-white/20 text-white'
                          : 'bg-[#050505] border-white/5 text-on-surface-variant/40 hover:border-white/15'
                      }`}
                    >
                      {isPassed ? (
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </button>
                    
                    <div className="space-y-0.5">
                      <p className={`text-[10px] font-sans font-bold uppercase tracking-wider ${
                        isActive ? 'text-primary' : isPassed ? 'text-on-surface' : 'text-on-surface-variant/40'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-[8px] font-sans text-on-surface-variant/50 hidden sm:block">
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="pt-4 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <p className="text-on-surface-variant/75 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm font-bold text-white animate-spin">
                sync
              </span>
              <span>Our chef baristas are currently curating your selection.</span>
            </p>
            <div className="flex bg-surface-container-low border border-white/5 px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wider uppercase">
              Table {order.tableNumber} • Diner Party of {order.peopleToSplit}
            </div>
          </div>
        </div>

        {/* Accordion Expandable Invoice Receipt detail info */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 p-5 shadow-sm">
          <div
            onClick={() => setShowBillingDetails(!showBillingDetails)}
            className="flex justify-between items-center cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                receipt_long
              </span>
              <h3 className="font-serif text-lg text-on-surface font-medium">
                View Receipt Summary
              </h3>
            </div>
            
            <span className="material-symbols-outlined text-on-surface-variant/70 transform transition-transform duration-200">
              {showBillingDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
          </div>

          {showBillingDetails && (
            <div className="pt-5 mt-4 border-t border-outline-variant/10 space-y-4 text-xs">
              <div className="space-y-3">
                {order.items.map((item) => {
                  const sizePremium = item.size === 'S' ? 0 : item.size === 'M' ? 40 : 80;
                  const milkPremium = item.milkType === 'Whole Milk' ? 0 : item.milkType === 'Oat Milk' ? 40 : 50;
                  const extraShotPremium = item.toppings.includes('Extra Shot Espresso') ? 60 : 0;
                  const whippedCreamPremium = item.toppings.includes('Whipped Cream') ? 30 : 0;
                  const singlePrice = item.menuItem.price + sizePremium + milkPremium + extraShotPremium + whippedCreamPremium;

                  return (
                    <div key={item.id} className="flex justify-between items-start py-2 border-b border-outline-variant/5 last:border-b-0">
                      <div>
                        <p className="font-bold text-on-surface">
                          {item.menuItem.name} <span className="text-primary font-serif">x{item.quantity}</span>
                        </p>
                        <p className="text-[10px] text-on-surface-variant/60 block pt-0.5">
                          Size {item.size} • {item.milkType} • {item.sugarLevel}% Sweet
                          {item.toppings.length > 0 && ` • Add ${item.toppings.join(', ')}`}
                        </p>
                      </div>
                      
                      <span className="font-serif font-semibold text-on-surface select-none">
                        ₹{(singlePrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Subtotals list */}
              <div className="space-y-2 pt-2 text-on-surface-variant border-t border-outline-variant/10 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal receipts</span>
                  <span className="font-serif">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.discountAmt > 0 && (
                  <div className="flex justify-between text-white font-bold">
                    <span>Discount certificate applied</span>
                    <span className="font-serif">- ₹{order.discountAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST &amp; SGST Cafe tax (5%)</span>
                  <span className="font-serif">₹{order.gstAmt.toLocaleString('en-IN')}</span>
                </div>
                {order.scEnabled && (
                  <div className="flex justify-between">
                    <span>Steamed service charge (10%)</span>
                    <span className="font-serif">₹{order.serviceChargeAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#e5e2e1] font-bold text-sm pt-2 border-t border-outline-variant/10">
                  <span className="text-primary">Total Paid Invoice</span>
                  <span className="text-primary font-serif">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bento Grid: while you wait section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          
          {/* Box 1: Brewing Story description detail */}
          <div className="bg-[#0c0c0c] rounded-2xl border border-white/5 p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-16 -bottom-16 w-32 h-32 aroma-glow pointer-events-none" />
            <div className="space-y-2 text-left">
              <span className="material-symbols-outlined text-white text-3xl">local_cafe</span>
              <h4 className="font-serif text-base text-on-surface font-semibold">
                Our Brewing Philosophy
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                The single-origin Ethiopian washed berries packed in your French Press are slow roasted at 214°C to extract citrus flower fragrance, guaranteeing that every sip is robust, vivid, and lingering.
              </p>
            </div>
            <p className="text-[10px] font-sans font-bold text-white tracking-widest uppercase border-t border-white/5 pt-3 mt-3 select-none">
              the slow coffee craft • yirgacheffe
            </p>
          </div>

          {/* Box 2: Posh Rewards invitation */}
          <div className="bg-[#0c0c0c] rounded-2xl border border-white/5 p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-16 -bottom-16 w-32 h-32 aroma-glow pointer-events-none" />
            <div className="space-y-2 text-left">
              <span className="material-symbols-outlined text-white text-3xl">reward_ed_ads</span>
              <h4 className="font-serif text-base text-on-surface font-semibold">
                Posh Connoisseur Club
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You are currently earning double points on today's order! Connect today or check your loyalty status to unlock hand-dripped invites and tasting lounge prioritizations.
              </p>
            </div>

            <button
              onClick={onGoToRewards}
              className="text-left w-full text-[10px] font-sans font-bold text-white tracking-widest uppercase border-t border-white/5 pt-3 mt-3 flex items-center justify-between group cursor-pointer"
            >
              <span>Explore Connoisseur Lounge</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
                arrow_forward
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
