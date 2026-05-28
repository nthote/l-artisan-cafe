import { useState, useEffect } from 'react';
import { INITIAL_MENU_ITEMS } from './data';
import { MenuItem, CartItem, Order, FeedbackRating } from './types';

// Import modular sensory sub-views
import SplashView from './components/SplashView';
import MenuView from './components/MenuView';
import CustomizeModal from './components/CustomizeModal';
import CartView from './components/CartView';
import TrackingView from './components/TrackingView';
import FeedbackView from './components/FeedbackView';
import RewardsView from './components/RewardsView';
import AdminPortal from './components/AdminPortal';
import StaffAuthModal from './components/StaffAuthModal';

export default function App() {
  // Global Operational state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [tableNumber, setTableNumber] = useState<number>(12); // standard default
  
  // Navigation / Control state
  const [roleMode, setRoleMode] = useState<'customer' | 'admin'>('customer');
  const [showStaffAuth, setShowStaffAuth] = useState(false);
  const [customerScreen, setCustomerScreen] = useState<'splash' | 'menu' | 'cart' | 'tracking' | 'feedback' | 'rewards'>('splash');
  
  // Customization selection modal trigger
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Secure checkout simulated loading spinner levels
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'authenticating' | 'celebrating'>('idle');
  const [checkoutInvoice, setCheckoutInvoice] = useState<any>(null);

  // Toast array notification Alerts
  const [toasts, setToasts] = useState<{ id: string; msg: string; icon?: string }[]>([]);

  // Automatically parse table number query parameter from current URL to support QR dine-in routing!
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tbl = params.get('table');
      if (tbl) {
        const parsed = parseInt(tbl, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 30) {
          setTableNumber(parsed);
          // If launched via QR table scan, route straight past splash to the real menu!
          setCustomerScreen('menu');
          triggerToast(`Dine-In Table ${parsed} Connected Successfully!`, 'table_restaurant');
        }
      }
    } catch (e) {
      console.warn('Could not parse window query params', e);
    }
  }, []);

  // Quick Notification trigger
  const triggerToast = (msg: string, icon = 'info') => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, msg, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleSummonWaiter = (tableNum = tableNumber) => {
    triggerToast(`Barista curation summoned to Table ${tableNum}!`, 'concierge_bell');
  };

  // Add Item customization to Basket
  const handleAddToCart = (customItem: CartItem) => {
    setCart((prev) => {
      // Look for identical line item (same menuItem, size, milk, toppings, etc.)
      const matchedIdx = prev.findIndex(
        (it) =>
          it.menuItem.id === customItem.menuItem.id &&
          it.size === customItem.size &&
          it.milkType === customItem.milkType &&
          it.sugarLevel === customItem.sugarLevel &&
          JSON.stringify(it.toppings.sort()) === JSON.stringify(customItem.toppings.sort())
      );

      if (matchedIdx > -1) {
        const copy = [...prev];
        copy[matchedIdx].quantity += customItem.quantity;
        return copy;
      }
      return [...prev, customItem];
    });

    triggerToast(`${customItem.quantity}x ${customItem.menuItem.name} added to Table Basket!`, 'done_all');
  };

  // Cart operations
  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => (it.id === cartId ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((it) => it.id !== cartId));
    triggerToast('Selection removed from your order.', 'delete');
  };

  // Initiate gourmet checkout flow (with security spinning overlays)
  const handleCheckoutInit = (invoiceDetails: {
    subtotal: number;
    discountAmt: number;
    gstAmt: number;
    serviceChargeAmt: number;
    finalTotal: number;
    peopleToSplit: number;
    scEnabled: boolean;
  }) => {
    setCheckoutInvoice(invoiceDetails);
    setCheckoutStatus('authenticating');

    // Step 1: Simulated Secure payment authorization loops
    setTimeout(() => {
      setCheckoutStatus('celebrating');
      
      // Submit order package to synced managers Kitchen
      const newOrder: Order = {
        id: `POSH-${Math.floor(1000 + Math.random() * 9000)}`,
        tableNumber,
        items: [...cart],
        subtotal: invoiceDetails.subtotal,
        discountAmt: invoiceDetails.discountAmt,
        gstAmt: invoiceDetails.gstAmt,
        serviceChargeAmt: invoiceDetails.serviceChargeAmt,
        total: invoiceDetails.finalTotal,
        status: 'Received',
        elapsedTime: 12,
        scEnabled: invoiceDetails.scEnabled,
        peopleToSplit: invoiceDetails.peopleToSplit,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrder(newOrder);
      setCart([]); // Clear cart basket

      // Part 2: Conclude celebration splash and transition to timeline active tracking
      setTimeout(() => {
        setCheckoutStatus('idle');
        setCustomerScreen('tracking');
        triggerToast('Tasting Ticket Registered in Kitchen Hub!', 'restaurant_menu');
      }, 3500);

    }, 2800);
  };

  // Kitchen management triggers
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // If active tracking order matches, sync client view
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const alertStatus =
      newStatus === 'Preparing'
        ? 'is now being crafted'
        : newStatus === 'Ready'
        ? 'is ready at the counter!'
        : 'has been served!';
    triggerToast(`Order ${orderId} ${alertStatus}`, 'coffee_maker');
  };

  // Directory editing hooks
  const handleAddMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [...prev, item]);
    triggerToast(`Added "${item.name}" to sensory cards!`, 'add');
  };

  const handleUpdateMenuItem = (updated: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    triggerToast(`Successfully modified catalog parameters!`, 'check');
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`Item deleted from catalog.`, 'delete');
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface overflow-x-hidden selection:bg-primary/30 antialiased">
      
      {/* Floating Role Controller Capsule (Exclusive for AI Studio Showcase) */}
      <div className="fixed top-20 right-6 z-50 pointer-events-auto">
        <div className="glass-panel p-2 rounded-full shadow-2xl flex items-center gap-1 border border-white/10 select-none">
          <button
            onClick={() => {
              setRoleMode('customer');
              if (customerScreen === 'splash') setCustomerScreen('menu');
            }}
            className={`px-4.5 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              roleMode === 'customer'
                ? 'bg-white text-black'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">flat_ware</span>
            <span>Customer View</span>
          </button>

          <button
            onClick={() => {
              if (roleMode !== 'admin') {
                setShowStaffAuth(true);
              }
            }}
            className={`px-4.5 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              roleMode === 'admin'
                ? 'bg-white text-black'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            <span>Staff Portal</span>
            {roleMode !== 'admin' && (
              <span className="material-symbols-outlined text-[11px] opacity-60">lock</span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Real-Time System Notifications */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass rounded-xl p-4 shadow-xl border-l-4 border-l-white flex items-center gap-3 animate-fade-in pointer-events-auto text-left relative overflow-hidden"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">
              {toast.icon}
            </span>
            <p className="font-sans text-xs font-bold text-[#e5e2e1]">
              {toast.msg}
            </p>
          </div>
        ))}
      </div>

      {/* RENDER SCREEN SEGMENTS */}
      {roleMode === 'admin' ? (
        /* Operational Admin dashboard views */
        <AdminPortal
          menuItems={menuItems}
          orders={orders}
          onAddMenuItem={handleAddMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onUpdateMenuItem={handleUpdateMenuItem}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      ) : (
        /* Consumers Storefront Flow */
        <>
          {customerScreen === 'splash' && (
            <SplashView onEnter={() => setCustomerScreen('menu')} />
          )}

          {customerScreen === 'menu' && (
            <MenuView
              cart={cart}
              menuItems={menuItems}
              tableNumber={tableNumber}
              onSelectItem={setSelectedMenuItem}
              onSummonWaiter={() => handleSummonWaiter()}
              onViewCart={() => setCustomerScreen('cart')}
              setTableNumber={setTableNumber}
            />
          )}

          {customerScreen === 'cart' && (
            <CartView
              cart={cart}
              tableNumber={tableNumber}
              onBackToMenu={() => setCustomerScreen('menu')}
              onCheckout={handleCheckoutInit}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}

          {customerScreen === 'tracking' && (
            <TrackingView
              order={activeOrder}
              onBackToMenu={() => setCustomerScreen('menu')}
              onGoToRewards={() => setCustomerScreen('rewards')}
              onOpenFeedback={() => setCustomerScreen('feedback')}
              onSummonWaiterTarget={(tbl) => handleSummonWaiter(tbl)}
            />
          )}

          {customerScreen === 'feedback' && (
            <FeedbackView
              order={activeOrder}
              onBackToMenu={() => setCustomerScreen('menu')}
              onSubmit={(feedback: FeedbackRating) => {
                triggerToast('Sensory feedback submitted successfully!', 'emoji_events');
              }}
            />
          )}

          {customerScreen === 'rewards' && (
            <RewardsView onBackToMenu={() => setCustomerScreen('menu')} />
          )}
        </>
      )}

      {/* CUSTOMIZATION DRAWER SHEET OVERLAY */}
      {selectedMenuItem && (
        <CustomizeModal
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* SECURE STAFF AUTHENTICATION DIALOG */}
      {showStaffAuth && (
        <StaffAuthModal
          onSuccess={() => {
            setRoleMode('admin');
            setShowStaffAuth(false);
          }}
          onClose={() => setShowStaffAuth(false)}
          triggerToast={triggerToast}
        />
      )}

      {/* AUTHENTICATING SECURE PAYMENT LOOPS OVERLAY */}
      {checkoutStatus === 'authenticating' && (
        <div className="fixed inset-0 z-50 bg-[#131313]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="relative">
            {/* Spinning Loader */}
            <div className="w-18 h-18 border-4 border-[#252525] border-t-primary rounded-full animate-spin" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
            </div>
          </div>
          
          <h2 className="font-serif text-2xl text-on-surface mt-6 mb-2">Authenticating Secure Lounge Payment</h2>
          <p className="text-on-surface-variant text-xs font-sans tracking-widest uppercase">
            Processing through Indian Gateway systems safely
          </p>
          <div className="mt-4 flex gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      {/* CHEER CELEBRATION PAY SUCCESS OVERLAY */}
      {checkoutStatus === 'celebrating' && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden text-left relative">
          
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, inx) => {
              const bgCols = ['bg-white', 'bg-[#aaaaaa]', 'bg-[#444444]', 'bg-[#cccccc]'];
              const col = bgCols[inx % bgCols.length];
              return (
                <div
                  key={inx}
                  className={`absolute rounded-full opacity-60 ${col}`}
                  style={{
                    width: `${Math.random() * 5 + 3}px`,
                    height: `${Math.random() * 5 + 3}px`,
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animation: `fallDown ${Math.random() * 2.5 + 2}s linear infinite`,
                    animationDelay: `${Math.random() * 1.5}s`,
                  }}
                />
              );
            })}
          </div>

          <style>{`
            @keyframes fallDown {
              0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
              100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
            }
          `}</style>

          {/* Core celebration check symbol */}
          <div className="animate-bounce w-20 h-20 rounded-full bg-white/5 border border-white/25 flex items-center justify-center text-white mb-6">
            <span className="material-symbols-outlined text-[44px] font-extrabold">check_circle</span>
          </div>

          <h2 className="font-serif text-3xl text-white font-light tracking-wide mb-1 italic">Payment Successful!</h2>
          <p className="text-on-surface-variant text-xs font-sans tracking-[0.25em] uppercase font-bold">
            CURATING YOUR INVOICE REFRESHMENT
          </p>

          <div className="h-[1px] w-12 bg-white/15 my-5" />

          {checkoutInvoice && (
            <div className="bg-[#0c0c0c] p-5.5 rounded-2xl border border-outline-variant/15 w-full max-w-sm font-sans space-y-4 shadow-xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Transaction reference</span>
                <span className="font-mono text-white font-bold">#ART-LP-{(Math.floor(100000 + Math.random() * 900000))}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-y border-outline-variant/10 py-3">
                <span className="text-on-surface-variant">Lounge Dine-In Table</span>
                <span className="font-bold text-white">Table {tableNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-1">
                <span className="text-white">Total Paid Amount</span>
                <span className="text-white font-serif text-lg font-light italic">₹{checkoutInvoice.finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CORE BOTTOM SENSORY NAV BAR (Sticky floating menu switchers) */}
      {roleMode === 'customer' && customerScreen !== 'splash' && (
        <div className="fixed bottom-0 left-0 right-0 py-3 pb-6 bg-[#090909]/95 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center z-40 select-none shadow-2xl">
          {[
            { id: 'menu', label: 'Cafe Storefront', icon: 'local_cafe' },
            { id: 'cart', label: 'Cart Basket', icon: 'shopping_basket', count: cart.reduce((s, c) => s + c.quantity, 0) },
            { id: 'tracking', label: 'Track Order', icon: 'timeline', count: activeOrder ? 1 : 0 },
            { id: 'rewards', label: 'VIP Rewards', icon: 'military_tech' },
          ].map((itm) => {
            const isActive = customerScreen === itm.id;
            return (
              <button
                key={itm.id}
                onClick={() => setCustomerScreen(itm.id as any)}
                className={`relative flex flex-col items-center justify-center gap-1.5 transition-all outline-none cursor-pointer group ${
                  isActive ? 'text-white font-medium' : 'text-on-surface-variant/65 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-white/10' : 'group-hover:bg-[#222222]/30'}`}>
                  <span className="material-symbols-outlined text-[23px]">
                    {itm.icon}
                  </span>
                </div>
                <span className="text-[9px] font-sans font-bold tracking-widest uppercase">
                  {itm.label}
                </span>

                {/* Badging dots */}
                {itm.count !== undefined && itm.count > 0 && (
                  <span className="absolute top-1 right-2 bg-white text-black font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-background">
                    {itm.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
