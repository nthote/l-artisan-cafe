import { useState, useMemo } from 'react';
import { MenuItem, CartItem } from '../types';

interface MenuViewProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  tableNumber: number;
  setTableNumber: (num: number) => void;
  onSelectItem: (item: MenuItem) => void;
  onViewCart: () => void;
  onSummonWaiter: () => void;
}

export default function MenuView({
  menuItems,
  cart,
  tableNumber,
  setTableNumber,
  onSelectItem,
  onViewCart,
  onSummonWaiter,
}: MenuViewProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Coffee' | 'Tea' | 'Pastries' | 'Brunch'>('All');
  const [showTableSelector, setShowTableSelector] = useState(false);

  // Filter items in real-time
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchText, selectedCategory]);

  // Aggregate cart details
  const cartTotalQuantity = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      // Calculate item total using base price and extras
      const extraShotPrice = item.toppings.includes('Extra Shot Espresso') ? 60 : 0;
      const whippedCreamPrice = item.toppings.includes('Whipped Cream') ? 30 : 0;
      const milkPremium = item.milkType === 'Whole Milk' ? 0 : item.milkType === 'Oat Milk' ? 40 : 50;
      const sizePremium = item.size === 'S' ? 0 : item.size === 'M' ? 40 : 80;
      
      const singlePrice = item.menuItem.price + sizePremium + milkPremium + extraShotPrice + whippedCreamPrice;
      return total + (singlePrice * item.quantity);
    }, 0);
  }, [cart]);

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-36 pt-24 font-sans selection:bg-primary/35">
      {/* Top App Bar Header */}
      <nav className="fixed top-0 left-0 right-0 w-full z-45 bg-[#050505]/85 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center px-6 h-16 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[28px] cursor-pointer hover:opacity-85 select-none active:scale-95 transition-all">
            menu
          </span>
          <span className="font-serif text-xl md:text-2xl text-primary font-semibold tracking-tight select-none">
            L'Artisan Café
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Diner Table Tag badge */}
          <div
            onClick={() => setShowTableSelector(!showTableSelector)}
            className="flex items-center bg-primary-container text-on-primary-container px-3.5 py-1 rounded-full gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-xs">table_restaurant</span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">
              Table {tableNumber}
            </span>
          </div>

          {/* Quick Table Selection drop option for visual feedback */}
          {showTableSelector && (
            <div className="absolute right-20 top-14 bg-surface-container-high border border-outline-variant/40 rounded-xl p-3 shadow-2xl z-50 w-44">
              <p className="font-sans font-semibold tracking-widest text-[9px] text-on-surface-variant uppercase mb-2 text-center border-b border-outline-variant/20 pb-1.5">
                Select table number
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 5, 8, 11, 12, 14, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setTableNumber(num);
                      setShowTableSelector(false);
                    }}
                    className={`w-8 h-8 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center ${
                      tableNumber === num
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-low hover:bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summon Waiter Notify button */}
          <button
            onClick={onSummonWaiter}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:opacity-90 active:scale-95 transition-all border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* Chef portrait avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 select-none">
            <img
              alt="Staff Manager"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA95C5aLDKCymL9GZWbWIiVdc1vAeI2V4SdP6NVTmpeATmkxbVuEjqNLdvm72IIfpXgblVIATDoZ1R7sco_DvLSbI0Vmg823lvIzzSlfBzmMTCYIixeaCM4B2G4AnWOxLvDVNl1yFUsQUT2QTp_jTl7ZGOvY8nIaZvZK1yiMTSzQmXi9RXnem_NawdLiubcuShNtKV_D3KQlIFnkThbp6w3RiTxBNU0tPPLpwouFh_SmckITK54gOu7aMPI4_UFtcIaLAmAAmHPGVQ"
            />
          </div>
        </div>
      </nav>

      {/* Main Container Wrapper */}
      <main className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Greetings Section */}
        <header className="space-y-4">
          <div className="space-y-1">
            <p className="text-on-surface-variant/75 text-sm font-sans tracking-wide">
              Greetings from the roastery,
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-primary font-medium tracking-tight">
              Good Morning, Table {tableNumber}
            </h1>
          </div>

          {/* Embedded Chef Special glassmorphic layout card */}
          {menuItems.find((m) => m.id === 'm4') && (
            <div className="relative overflow-hidden rounded-2xl glass p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg border border-outline-variant/25">
              <div className="absolute -top-24 -right-24 w-64 h-64 aroma-glow pointer-events-none" />
              
              <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden border border-outline-variant/20 shadow-md">
                <img
                  className="w-full h-full object-cover select-none"
                  alt="Gold-Flaked Caramel Macchiato"
                  src={menuItems.find((m) => m.id === 'm4')?.imageUrl}
                />
              </div>

              <div className="flex-1 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-primary font-sans text-[11px] font-semibold tracking-[0.25em] uppercase">
                    Chef's Special
                  </span>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-on-surface">
                  Gold-Flaked Caramel Macchiato
                </h2>
                
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">
                  A decadent blend of our signature dark roast espresso, house-made salted caramel, and steamed organic oat milk, topped with 24k edible gold flakes for a truly royal experience.
                </p>
                
                <div className="flex items-center gap-6 pt-2">
                  <span className="text-white font-serif text-2xl font-light italic">
                    ₹640
                  </span>
                  <button
                    onClick={() => {
                      const item = menuItems.find((m) => m.id === 'm4');
                      if (item) onSelectItem(item);
                    }}
                    className="bg-white text-black px-8 py-3 rounded-full font-sans font-medium text-xs tracking-[0.25em] uppercase hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.06)] cursor-pointer border border-white/10"
                  >
                    ADD TO TABLE
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic Search & Filter section */}
        <section className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full bg-surface-container-high border-none rounded-full py-4 pl-12 pr-6 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40 outline-none text-sm"
              placeholder="Search our signature blends..."
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-[#2a2a2a] px-6 py-4 rounded-full text-on-surface hover:bg-surface-variant transition-colors active:scale-95 shrink-0 border border-outline-variant/15">
            <span className="material-symbols-outlined text-[20px] text-primary">filter_list</span>
            <span className="font-sans text-xs font-semibold tracking-wider uppercase">Filters</span>
          </button>
        </section>

        {/* Category Horizontal Scrolling Navigation Bar */}
        <section className="no-scrollbar overflow-x-auto select-none">
          <div className="flex gap-3 min-w-max pb-3">
            {(['All', 'Coffee', 'Tea', 'Pastries', 'Brunch'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all select-none ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-md shadow-white/5 font-medium'
                    : 'bg-[#141414] text-on-surface hover:bg-surface-container-highest border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Grid representing visual menu cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between shadow-md"
            >
              {/* Product Visual */}
              <div className="relative h-60 overflow-hidden select-none">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.name}
                  src={item.imageUrl}
                />
                
                {/* Visual tags overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-surface/80 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm border border-outline-variant/20"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tag === 'Non-Veg' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      />
                      <span className="text-[10px] text-white font-bold uppercase tracking-tighter">
                        {tag}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Informative text details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-serif text-[19px] leading-snug text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-white font-serif text-lg font-light italic tracking-tight">
                      ₹{item.price}
                    </span>
                  </div>
                  
                  <p className="text-on-surface-variant text-[13px] line-clamp-2 leading-relaxed h-10 overflow-hidden">
                    {item.description}
                  </p>
                </div>

                {/* Adding triggers */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] text-[#d0c5af]/50">
                    {item.category}
                  </span>
                  
                  <button
                    onClick={() => onSelectItem(item)}
                    className="bg-[#141414] text-white hover:bg-white hover:text-black border border-white/10 hover:border-transparent px-5 py-2 rounded-lg font-sans font-medium text-xs tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-on-surface-variant/60">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">
                coffee_off
              </span>
              <p className="font-sans text-sm tracking-wide">
                No exquisite blends found matching your description.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Floating Bottom Cart Action Row */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-45">
          <div
            onClick={onViewCart}
            className="glass rounded-2xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.55)] cursor-pointer hover:bg-white/5 transition-all border border-white/10 flex items-center justify-between group flex-row"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white text-black w-11 h-11 rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
              <div className="text-left">
                <p className="font-sans text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                  {cartTotalQuantity} {cartTotalQuantity === 1 ? 'Item' : 'Items'} Selected
                </p>
                <p className="text-white text-lg font-serif font-light italic">
                  ₹{cartTotalPrice.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white font-sans text-xs tracking-widest uppercase group-hover:translate-x-1 transition-transform select-none">
              <span>View Cart</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
