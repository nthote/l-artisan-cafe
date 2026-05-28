import { useState, useMemo } from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  tableNumber: number;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onBackToMenu: () => void;
  onCheckout: (invoiceDetails: {
    subtotal: number;
    discountAmt: number;
    gstAmt: number;
    serviceChargeAmt: number;
    finalTotal: number;
    peopleToSplit: number;
    scEnabled: boolean;
  }) => void;
}

export default function CartView({
  cart,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onBackToMenu,
  onCheckout,
}: CartViewProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoAppliedMsg, setPromoAppliedMsg] = useState('');
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(true);
  const [splitCount, setSplitCount] = useState(1);

  // Apply visual promocodes
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ARTISAN10') {
      setDiscountPercent(10);
      setPromoAppliedMsg('10% VIP coupon applied successfully!');
    } else if (code === 'ARTISAN20' || code === 'LOUNGE20') {
      setDiscountPercent(20);
      setPromoAppliedMsg('20% Exclusive Grand discount applied successfully!');
    } else if (code === 'POSH30') {
      setDiscountPercent(30);
      setPromoAppliedMsg('30% Artisan Connoisseur promotion applied successfully!');
    } else {
      setPromoAppliedMsg('Invalid promotional code. Please try another.');
      setDiscountPercent(0);
    }
  };

  // Pricing calculations
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const extraShotPrice = item.toppings.includes('Extra Shot Espresso') ? 60 : 0;
      const whippedCreamPrice = item.toppings.includes('Whipped Cream') ? 30 : 0;
      const milkPremium = item.milkType === 'Whole Milk' ? 0 : item.milkType === 'Oat Milk' ? 40 : 50;
      const sizePremium = item.size === 'S' ? 0 : item.size === 'M' ? 40 : 80;
      
      const singlePrice = item.menuItem.price + sizePremium + milkPremium + extraShotPrice + whippedCreamPrice;
      return total + (singlePrice * item.quantity);
    }, 0);
  }, [cart]);

  const discountAmt = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const discountedSubtotal = subtotal - discountAmt;

  const gstAmt = useMemo(() => {
    // 5% standard café GST inside Indian fine-dine
    return discountedSubtotal * 0.05;
  }, [discountedSubtotal]);

  const serviceChargeAmt = useMemo(() => {
    // 10% standard service charge if enabled
    return serviceChargeEnabled ? discountedSubtotal * 0.10 : 0;
  }, [discountedSubtotal, serviceChargeEnabled]);

  const finalTotal = useMemo(() => {
    return discountedSubtotal + gstAmt + serviceChargeAmt;
  }, [discountedSubtotal, gstAmt, serviceChargeAmt]);

  const pricePerPerson = useMemo(() => {
    return finalTotal / splitCount;
  }, [finalTotal, splitCount]);

  const handleProceedPay = () => {
    onCheckout({
      subtotal,
      discountAmt,
      gstAmt,
      serviceChargeAmt,
      finalTotal,
      peopleToSplit: splitCount,
      scEnabled: serviceChargeEnabled,
    });
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pt-24 pb-36 font-sans">
      
      {/* Back Button Navigation Header */}
      <div className="max-w-4xl mx-auto px-6 mb-8 flex justify-between items-center select-none">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2.5 text-on-surface-variant hover:text-white font-bold text-xs tracking-wider uppercase bg-[#0c0c0c] px-4.5 py-2.5 rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Sensory Menu</span>
        </button>

        <h1 className="font-serif text-xl sm:text-2xl text-primary font-semibold">
          Your Curated Basket — Table {tableNumber}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Cart items panel listing */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/15 space-y-4 shadow-sm">
            <h2 className="font-serif text-lg text-on-surface border-b border-outline-variant/10 pb-3 font-medium">
              Aromatic Selections
            </h2>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant/40 space-y-3">
                <span className="material-symbols-outlined text-4xl text-outline-variant">
                  shopping_cart_checkout
                </span>
                <p className="font-sans text-sm">Your gourmet cup is currently empty.</p>
                <button
                  onClick={onBackToMenu}
                  className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-primary/20 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {cart.map((item) => {
                  // Calculate raw price per item row (single pricing)
                  const sizePremium = item.size === 'S' ? 0 : item.size === 'M' ? 40 : 80;
                  const milkPremium = item.milkType === 'Whole Milk' ? 0 : item.milkType === 'Oat Milk' ? 40 : 50;
                  const extraShotPremium = item.toppings.includes('Extra Shot Espresso') ? 60 : 0;
                  const whippedCreamPremium = item.toppings.includes('Whipped Cream') ? 30 : 0;
                  const singlePrice = item.menuItem.price + sizePremium + milkPremium + extraShotPremium + whippedCreamPremium;

                  return (
                    <div key={item.id} className="py-4.5 flex gap-4 first:pt-0 last:pb-0 items-start">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-outline-variant/20 shrink-0 select-none">
                        <img className="w-full h-full object-cover" src={item.menuItem.imageUrl} alt={item.menuItem.name} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-sans font-bold text-sm text-[#e5e2e1] truncate">
                            {item.menuItem.name}
                          </h3>
                          <span className="text-white font-serif text-sm font-light italic select-none shrink-0 text-right">
                            ₹{(singlePrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Custom selection tags representation */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant/75 bg-surface px-2 py-0.5 rounded-md border border-outline-variant/15">
                            Size {item.size}
                          </span>
                          <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant/75 bg-surface px-2 py-0.5 rounded-md border border-outline-variant/15">
                            {item.milkType}
                          </span>
                          <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant/75 bg-surface px-2 py-0.5 rounded-md border border-outline-variant/15">
                            {item.sugarLevel}% Sweet
                          </span>
                          {item.toppings.map((topping) => (
                            <span key={topping} className="text-[9px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                              + {topping}
                            </span>
                          ))}
                        </div>

                        {item.specialNotes && (
                          <p className="text-[11px] text-on-surface-variant/65 italic mt-2 bg-surface/35 px-2 py-1 rounded-md border border-outline-variant/5">
                            " {item.specialNotes} "
                          </p>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          {/* Stepper inputs */}
                          <div className="flex items-center gap-2.5 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/15 select-none">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center bg-surface hover:bg-surface-variant text-xs font-bold transition-transform cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-sans text-xs font-bold text-on-surface w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center bg-surface hover:bg-surface-variant text-xs font-bold transition-transform cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Quick bin remove button */}
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-on-surface-variant/60 hover:text-error transition-colors p-1 flex items-center justify-center cursor-pointer"
                            title="Remove Selection"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Luxury Promotional Coupons area */}
          <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/15 space-y-4 shadow-sm">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#d0c5af]">
              Promotional Certificate / Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-surface-container-low border border-outline-variant/25 rounded-xl px-4 py-3.5 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/30 uppercase tracking-widest outline-none focus:ring-1 focus:ring-primary/45"
                placeholder="e.g. ARTISAN20, POSH30"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                onClick={handleApplyPromo}
                className="bg-surface-container-high hover:bg-white hover:text-black text-white px-6 rounded-xl text-xs font-semibold font-sans tracking-widest uppercase transition-all shrink-0 border border-white/10 hover:border-transparent cursor-pointer"
              >
                Apply
              </button>
            </div>
            
            {promoAppliedMsg && (
              <p className={`text-[11px] font-sans font-bold uppercase tracking-wide ${
                discountPercent > 0 ? 'text-white' : 'text-error'
              }`}>
                {promoAppliedMsg}
              </p>
            )}

            <div className="flex justify-between p-3 rounded-xl bg-surface-container-low text-left border border-outline-variant/10 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#d0c5af] block">Tasting Room Coupons:</span>
                <span className="text-[10px] text-on-surface-variant/65">
                  • <strong>ARTISAN20</strong>: Save 20% on master blends
                </span>
                <span className="text-[10px] text-on-surface-variant/65 block">
                  • <strong>POSH30</strong>: Save 30% for Artisan Connoisseur
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice pricing summary sidebar panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/15 space-y-5 shadow-lg relative">
            <h2 className="font-serif text-lg text-on-surface pb-3 border-b border-outline-variant/10 font-medium">
              Summary Invoice
            </h2>

            {/* Pricing details rows */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal Reciepts</span>
                <span className="font-serif">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between items-center text-white font-bold">
                  <span>Exclusive Discs ({discountPercent}%)</span>
                  <span className="font-serif">- ₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Indian Central-State Cafe GST (5%)</span>
                <span className="font-serif">₹{gstAmt.toLocaleString('en-IN')}</span>
              </div>

              {/* Service charge toggle option */}
              <div className="pt-2.5 pb-2 border-y border-outline-variant/10 flex justify-between items-center gap-4">
                <div className="text-left">
                  <span className="text-xs font-bold text-on-surface block">
                    10% Suggested Service Charge
                  </span>
                  <span className="text-[10px] text-on-surface-variant/65 block">
                    Curated directly for hospitality curators
                  </span>
                </div>
                
                {/* Visual toggle bar */}
                <div
                  onClick={() => setServiceChargeEnabled(!serviceChargeEnabled)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                    serviceChargeEnabled ? 'bg-white' : 'bg-surface-variant border border-white/10'
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-[#050505] shadow-md transform transition-transform duration-200 ${
                    serviceChargeEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {serviceChargeEnabled && (
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Steamed Service Charge (10%)</span>
                  <span className="font-serif">₹{serviceChargeAmt.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Grand Total tag */}
              <div className="pt-3 flex justify-between items-center text-[#e5e2e1] font-bold text-base select-none">
                <span className="font-serif text-lg text-primary">Grand Subtotal</span>
                <span className="font-serif text-2xl text-primary">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Billing Split slide-bar calculations */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#d0c5af]">
                  Slide to Split Bill
                </h4>
                <span className="font-sans text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[10px]">
                  {splitCount} {splitCount === 1 ? 'Person' : 'People'}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                step="1"
                className="w-full accent-primary bg-surface-container-low h-1.5 rounded-lg cursor-pointer appearance-none"
                value={splitCount}
                onChange={(e) => setSplitCount(Number(e.target.value))}
              />

              {splitCount > 1 && (
                <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 flex justify-between items-center text-left">
                  <div>
                    <p className="font-sans text-xs font-bold text-primary tracking-wide">
                      Split Pricing:
                    </p>
                    <p className="text-[10px] text-on-surface-variant/70 leading-relaxed">
                      Equally divided for {splitCount} guests dining at Table {tableNumber}.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-xl font-light italic text-white animate-pulse">
                      ₹{Math.ceil(pricePerPerson).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">
                      Per Person
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Proceed Checkout Trigger CTA */}
            <button
              onClick={handleProceedPay}
              disabled={cart.length === 0}
              className={`w-full py-4.5 rounded-xl font-sans font-medium text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                cart.length === 0
                  ? 'bg-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed shadow-none'
                  : 'bg-white text-black hover:bg-[#e5e5e5] active:scale-95 shadow-[0_4px_30px_rgba(255,255,255,0.05)] border border-white/10'
              }`}
            >
              <span>PAY FOR TABLE — ₹{finalTotal.toLocaleString('en-IN')}</span>
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
