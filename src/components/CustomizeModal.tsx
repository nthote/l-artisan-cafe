import { useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';

interface CustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (customizedItem: CartItem) => void;
  initialCartItem?: CartItem; // optional, for edits if any
}

export default function CustomizeModal({
  item,
  onClose,
  onAddToCart,
  initialCartItem,
}: CustomizeModalProps) {
  // Return null early if no item is selected
  if (!item) return null;

  const [size, setSize] = useState<'S' | 'M' | 'L'>(initialCartItem?.size || 'M');
  const [milkType, setMilkType] = useState<'Whole Milk' | 'Oat Milk' | 'Almond Milk'>(
    initialCartItem?.milkType || 'Whole Milk'
  );
  const [sugarLevel, setSugarLevel] = useState<number>(initialCartItem?.sugarLevel ?? 50);
  const [toppings, setToppings] = useState<string[]>(initialCartItem?.toppings || []);
  const [specialNotes, setSpecialNotes] = useState(initialCartItem?.specialNotes || '');
  const [quantity, setQuantity] = useState(initialCartItem?.quantity || 1);

  // Close when pressing the escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Pricing constants
  const sizePremium = size === 'S' ? 0 : size === 'M' ? 40 : 80;
  const milkPremium = milkType === 'Whole Milk' ? 0 : milkType === 'Oat Milk' ? 40 : 50;
  const extraShotPremium = toppings.includes('Extra Shot Espresso') ? 60 : 0;
  const whippedCreamPremium = toppings.includes('Whipped Cream') ? 30 : 0;

  const singleItemPrice = item.price + sizePremium + milkPremium + extraShotPremium + whippedCreamPremium;
  const totalPrice = singleItemPrice * quantity;

  const toggleTopping = (toppingName: string) => {
    setToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleConfirm = () => {
    onAddToCart({
      id: initialCartItem?.id || `${item.id}-${Date.now()}`,
      menuItem: item,
      size,
      sugarLevel,
      milkType,
      toppings,
      specialNotes,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={onClose} />

      {/* Main Bottom Sheet / Centered Card */}
      <div className="relative w-full sm:max-w-lg bg-surface-container rounded-t-3xl sm:rounded-3xl border border-outline-variant/20 shadow-2xl overflow-hidden z-20 max-h-[92vh] sm:max-h-[85vh] flex flex-col">
        
        {/* Modal Top Handle bar (iOS style) */}
        <div className="sm:hidden flex justify-center py-3 border-b border-outline-variant/10">
          <div className="w-12 h-1 rounded-full bg-outline-variant/40" />
        </div>

        {/* Modal Scrollable Contents */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 no-scrollbar text-left">
          {/* Header section with photo cropped */}
          <div className="flex gap-4 items-center border-b border-outline-variant/15 pb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-outline-variant/30 shrink-0 select-none">
              <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl font-bold text-on-surface truncate">
                {item.name}
              </h3>
              <p className="text-on-surface-variant text-[11px] font-sans tracking-wide">
                Base price: ₹{item.price}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Sizing Select section */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              Select Blend Size
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['S', 'M', 'L'] as const).map((sz) => {
                const label = sz === 'S' ? 'Standard / S' : sz === 'M' ? 'Grande / M (+₹40)' : 'Royale / L (+₹80)';
                return (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`p-3.5 rounded-xl border font-sans font-bold text-xs tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      size === sz
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'
                    }`}
                  >
                    <span className="text-sm">{sz}</span>
                    <span className="text-[9px] font-medium text-center font-sans tracking-tight text-on-surface-variant/70">
                      {sz === 'S' ? 'Normal' : sz === 'M' ? '+₹40' : '+₹80'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sweetness Slider level */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#909090]">
                Sweetness Level
              </h4>
              <span className="font-sans text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[10px]">
                {sugarLevel}% Sugar
              </span>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                className="w-full accent-primary bg-surface-container-low h-1.5 rounded-lg cursor-pointer appearance-none"
                value={sugarLevel}
                onChange={(e) => setSugarLevel(Number(e.target.value))}
              />
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50 pt-1">
                <span>0% Unsweet</span>
                <span>50% Medium</span>
                <span>100% Extra</span>
              </div>
            </div>
          </div>

          {/* Milk Options list Selection */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              Steamed Milk Alternative
            </h4>
            <div className="space-y-2">
              {[
                { type: 'Whole Milk', price: 0, tag: 'Standard Dairy' },
                { type: 'Oat Milk', price: 40, tag: 'Barista Grade, Nutty' },
                { type: 'Almond Milk', price: 50, tag: 'Silky, Sweet Finish' }
              ].map((m) => (
                <div
                  key={m.type}
                  onClick={() => setMilkType(m.type as any)}
                  className={`flex justify-between items-center p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                    milkType === m.type
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      milkType === m.type ? 'border-primary' : 'border-outline-variant/40'
                    }`}>
                      {milkType === m.type && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <div className="text-left">
                      <p className="font-sans text-xs font-bold text-[#e5e2e1]">{m.type}</p>
                      <p className="text-[10px] text-on-surface-variant/60">{m.tag}</p>
                    </div>
                  </div>
                  <span className="font-serif text-sm font-semibold text-primary">
                    {m.price === 0 ? 'Free' : `+₹${m.price}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium topping options checkboxes */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              Exquisite Toppings
            </h4>
            <div className="space-y-2">
              {[
                { name: 'Extra Shot Espresso', label: 'Premium Gold Roast double-shot', price: 60, icon: 'coffee' },
                { name: 'Whipped Cream', label: 'Aromatic sweetened vanilla micro-cream', price: 30, icon: 'waves' },
              ].map((topping) => {
                const isSelected = toppings.includes(topping.name);
                return (
                  <div
                    key={topping.name}
                    onClick={() => toggleTopping(topping.name)}
                    className={`flex justify-between items-center p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-primary bg-primary/20 text-primary' : 'border-outline-variant/40'
                      }`}>
                        {isSelected && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                      </div>

                      <div className="text-left">
                        <p className="font-sans text-xs font-bold text-[#e5e2e1]">
                          {topping.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/60">
                          {topping.label}
                        </p>
                      </div>
                    </div>
                    
                    <span className="font-serif text-sm font-semibold text-primary">
                      +₹{topping.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Instruction custom area details */}
          <div className="space-y-2">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              Special Instructions
            </h4>
            <textarea
              className="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl p-3.5 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:ring-1 focus:ring-primary/45 h-16 resize-none"
              placeholder="e.g. Extra hot, splash of ice, sweetener on the side..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="bg-[#0c0c0c] border-t border-white/10 p-6 flex items-center justify-between gap-4 mt-auto">
          {/* Stepper counter quantities */}
          <div className="flex items-center gap-3.5 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/15 select-none shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:opacity-85 active:scale-90 select-none font-bold text-lg cursor-pointer"
            >
              -
            </button>
            <span className="font-sans text-sm font-bold text-on-surface min-w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:opacity-85 active:scale-90 select-none font-bold text-lg cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Main Action CTAs */}
          <button
            onClick={handleConfirm}
            className="flex-1 bg-white text-black hover:bg-[#e5e5e5] py-4 rounded-xl font-sans font-medium text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_25px_rgba(255,255,255,0.05)] cursor-pointer"
          >
            <span>Add — ₹{totalPrice.toLocaleString('en-IN')}</span>
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          </button>
        </div>

      </div>
    </div>
  );
}
