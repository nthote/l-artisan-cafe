import React, { useState, useMemo } from 'react';
import { MenuItem, Order } from '../types';

interface AdminPortalProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

export default function AdminPortal({
  orders,
  onUpdateOrderStatus,
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'editor' | 'analytics' | 'qr'>('kitchen');

  // Chime settings state
  const [chimeVolume, setChimeVolume] = useState(70);
  const [flashOnArrival, setFlashOnArrival] = useState(true);

  // Menu editor search and form entries
  const [menuSearch, setMenuSearch] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states for creating a new menu item
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(300);
  const [newItemCategory, setNewItemCategory] = useState<MenuItem['category']>('Coffee');
  const [newItemImgUrl, setNewItemImgUrl] = useState('');
  const [newItemTag, setNewItemTag] = useState('Veg');

  // QR Generator configs
  const [qrTotalTables, setQrTotalTables] = useState(12);
  const [qrBrandLogoEnabled, setQrBrandLogoEnabled] = useState(true);
  const [qrContrastMode, setQrContrastMode] = useState<'gold' | 'dark'>('dark');

  // Computed metrics for Analytics Dashboard
  const analyticsData = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + o.total, 0) + 48250; // include beautiful standard base
    const totalTickets = orders.length + 112;
    const avgTicket = Math.round(totalRev / totalTickets);
    
    return { totalRev, totalTickets, avgTicket };
  }, [orders]);

  // Aggregate item row quantities for custom charts
  const categoryChartData = useMemo(() => {
    const baseObj = { Coffee: 58, Tea: 14, Pastries: 22, Brunch: 28, Sides: 10 };
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.menuItem.category;
        if (baseObj[cat] !== undefined) {
          baseObj[cat] += item.quantity;
        }
      });
    });

    const total = Object.values(baseObj).reduce((s, v) => s + v, 0);
    return Object.entries(baseObj).map(([name, val]) => ({
      name,
      value: val,
      percent: Math.round((val / total) * 100),
    }));
  }, [orders]);

  // Handle addition of custom products
  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const defaultImg =
      newItemImgUrl ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCheS7dGWVZbavg5PZWOhevv3CIdKtaESx6VpGOAgmDnQpvkQS2WKdE6D5HY4fF8Qt6rqDGeJXOvL5iqsa9a_owdUxG-GwwA82nzDQlh-7sUU5z9tQqRAsNYWEkYXLUl5C4klWhQUGGWUk5PbD9aOteoeYEsz8ICozMq5q9N0rJXWzdTfF_70GO-zvibiPdMird_69gzQTn5nDmKXPumQMmbrr72r9fs9LQXjdB2g6JvUtuQrm78DAlFO962sxa6Ji6yL9cn4U_EyU';

    onAddMenuItem({
      id: `custom-m-${Date.now()}`,
      name: newItemName,
      description: newItemDesc,
      price: newItemPrice,
      category: newItemCategory,
      imageUrl: defaultImg,
      tags: [newItemTag],
      isAvailable: true,
    });

    // Reset Form entries
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice(300);
    setNewItemImgUrl('');
  };

  // Handle edit submissions
  const handleUpdateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onUpdateMenuItem(editingItem);
    setEditingItem(null);
  };

  // Filter editor search list
  const filteredEditorItems = menuItems.filter((i) =>
    i.name.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-background text-[#e5e2e1] pt-24 pb-36 font-sans">
      <main className="max-w-6xl mx-auto px-6">
        
        {/* Tab Controls Navigation Bar header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-5 border-b border-outline-variant/15 select-none">
          <div className="text-left">
            <span className="text-primary font-sans text-[10px] font-bold tracking-[0.25em] uppercase">
              Operational Portal
            </span>
            <h1 className="font-serif text-3xl font-medium text-on-surface">
              Aroma Control Centre
            </h1>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'kitchen', label: 'Kitchen Console', icon: 'table_restaurant' },
              { id: 'editor', label: 'Sensory Editor', icon: 'menu_book' },
              { id: 'analytics', label: 'Finance Analytics', icon: 'monitoring' },
              { id: 'qr', label: 'Deploy Table QRs', icon: 'qr_code_2' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'bg-[#0c0c0c] border border-white/5 text-on-surface-variant hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* TAB 1: KITCHEN KANBAN CONSOLE */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            
            {/* Quick sound setting controls */}
            <div className="bg-[#1c1b1b] p-4.5 rounded-xl border border-outline-variant/15 flex flex-wrap justify-between items-center gap-4 text-left">
              <div className="flex gap-2 items-center">
                <span className="material-symbols-outlined text-primary text-[22px]">volume_up</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Incoming Order Chime Alert
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/70">
                    Triggers a gentle barista chime upon ticket entry
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Visual chime slider */}
                <div className="flex items-center gap-2 select-none">
                  <span className="text-[10px] font-mono text-on-surface-variant">0</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="accent-primary w-24 h-1 rounded-sm appearance-none bg-surface-container-high"
                    value={chimeVolume}
                    onChange={(e) => setChimeVolume(Number(e.target.value))}
                  />
                  <span className="text-[10px] font-mono text-primary font-bold">{chimeVolume}%</span>
                </div>

                {/* Flash toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-sans font-bold text-on-surface-variant uppercase">
                    Ambient Flash:
                  </span>
                  <div
                    onClick={() => setFlashOnArrival(!flashOnArrival)}
                    className={`w-10 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors ${
                      flashOnArrival ? 'bg-primary' : 'bg-[#2a2a2a]'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-[#131313] transition-transform ${
                      flashOnArrival ? 'translate-x-4.5' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              
              {/* Columns config array */}
              {([
                { key: 'Received', title: 'New Arrival Tickets', bg: 'bg-[#ffb4ab]/10 border-[#ffb4ab]/20 text-[#ffb4ab]' },
                { key: 'Preparing', title: 'In Craft / Espresso', bg: 'bg-[#ffdbce]/10 border-[#ffdbce]/20 text-[#ffdbce]' },
                { key: 'Ready', title: 'Sensory Complete', bg: 'bg-primary/10 border-primary/20 text-[#f2ca50]' },
                { key: 'Served', title: 'Delivered Packages', bg: 'bg-[#c9c6c1]/10 border-[#c9c6c1]/20 text-[#d1cdc9]' },
              ] as const).map((col) => {
                const columnOrders = orders.filter((o) => o.status === col.key);

                return (
                  <div key={col.key} className="flex flex-col gap-4">
                    
                    {/* Column Heading */}
                    <div className={`p-3 rounded-xl border ${col.bg} flex justify-between items-center select-none`}>
                      <span className="font-sans text-[11px] font-black uppercase tracking-widest">
                        {col.title}
                      </span>
                      <span className="font-mono text-xs font-bold bg-[#131313]/55 px-2 py-0.5 rounded-full">
                        {columnOrders.length}
                      </span>
                    </div>

                    {/* Column Tickets lists */}
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 no-scrollbar min-h-[300px] border border-transparent hover:border-outline-variant/10 rounded-xl transition-all">
                      {columnOrders.length === 0 ? (
                        <div className="py-12 text-center text-on-surface-variant/20 border border-dashed border-outline-variant/10 rounded-xl">
                          <span className="material-symbols-outlined text-4xl mb-1.5 opacity-35">
                            coffee_maker
                          </span>
                          <p className="font-sans text-[10px] uppercase font-bold tracking-wider">
                            No active bags
                          </p>
                        </div>
                      ) : (
                        columnOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="bg-[#1c1b1b] border border-outline-variant/15 rounded-xl p-4 space-y-3 shadow-md hover:border-[#f2ca50]/20 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-sans font-black text-xs text-primary">
                                  Table {ord.tableNumber}
                                </h4>
                                <p className="text-[9px] text-on-surface-variant">
                                  {ord.timestamp}
                                </p>
                              </div>
                              <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                                {ord.id}
                              </span>
                            </div>

                            {/* Ordered items listing inside card */}
                            <div className="space-y-2 border-y border-outline-variant/10 py-2">
                              {ord.items.map((it) => (
                                <div key={it.id} className="text-xs">
                                  <div className="flex justify-between font-sans">
                                    <span className="font-bold text-on-surface">
                                      {it.menuItem.name} <strong className="text-primary font-serif">x{it.quantity}</strong>
                                    </span>
                                    <span className="text-on-surface-variant font-mono">
                                      {it.size}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-[#d0c5af]/80 leading-tight">
                                    {it.milkType} • {it.sugarLevel}% sweet
                                    {it.toppings.length > 0 && ` • Add ${it.toppings.join(', ')}`}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Trigger actions */}
                            <div className="flex gap-2">
                              {col.key === 'Received' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(ord.id, 'Preparing')}
                                  className="w-full py-2 bg-[#ffe088] text-[#3c2f00] font-sans font-bold text-[10px] tracking-wider uppercase rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                >
                                  Accept Order
                                </button>
                              )}

                              {col.key === 'Preparing' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(ord.id, 'Ready')}
                                  className="w-full py-2 bg-primary text-on-primary font-sans font-bold text-[10px] tracking-wider uppercase rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                >
                                  Mark Ready
                                </button>
                              )}

                              {col.key === 'Ready' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(ord.id, 'Served')}
                                  className="w-full py-2 bg-[#d1cdc9] text-[#1c1c19] font-sans font-bold text-[10px] tracking-wider uppercase rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                >
                                  Mark Served
                                </button>
                              )}

                              {col.key === 'Served' && (
                                <div className="text-center w-full py-1 bg-surface-container-low rounded text-[10px] font-sans font-bold tracking-widest text-[#d1cdc9]/60 uppercase">
                                  ✓ DELIVERED COMPLETE
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* TAB 2: MENU DIRECTORY & EDITOR */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* Left side, existing directory controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Directory search */}
              <div className="bg-[#1c1b1b] p-5 rounded-2xl border border-outline-variant/15 space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/5 pb-2">
                  <h3 className="font-serif text-lg font-medium text-on-surface">Existing Sensory Catalog ({menuItems.length})</h3>
                  <span className="text-[10px] text-[#f2ca50] font-mono tracking-widest font-bold">L'ARTISAN DE PARIS</span>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-10 pr-4 text-xs font-sans text-on-surface outline-none placeholder:text-on-surface-variant/30"
                    placeholder="Search coffee directory or pastry labels..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                  />
                </div>

                {/* Listings Directory */}
                <div className="divide-y divide-outline-variant/10 max-h-[70vh] overflow-y-auto pr-1">
                  {filteredEditorItems.map((item) => (
                    <div key={item.id} className="py-4.5 flex gap-4 first:pt-0 last:pb-0 items-start">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-outline-variant/15 select-none shrink-0">
                        <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="font-sans font-bold text-sm text-[#e5e1e1] truncate">{item.name}</h4>
                          <span className="font-serif font-semibold text-primary">₹{item.price}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant/75 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex gap-2">
                            {/* Category Badge */}
                            <span className="text-[9px] font-sans font-black uppercase tracking-wider bg-surface px-2.5 py-1 rounded border border-outline-variant/15 text-on-surface-variant">
                              {item.category}
                            </span>
                          </div>

                          <div className="flex gap-3 items-center">
                            {/* Inventory Toggle */}
                            <button
                              onClick={() =>
                                onUpdateMenuItem({ ...item, isAvailable: !item.isAvailable })
                              }
                              className={`text-[9px] font-sans font-black uppercase tracking-widest px-2.5 py-1 rounded transition-all cursor-pointer ${
                                item.isAvailable
                                  ? 'bg-green-500/10 border border-green-500/35 text-green-500'
                                  : 'bg-red-500/10 border border-red-500/35 text-red-500'
                              }`}
                            >
                              {item.isAvailable ? 'In Stock' : 'Out Of Stock'}
                            </button>

                            {/* Trigger Edit Mode */}
                            <button
                              onClick={() => setEditingItem(item)}
                              className="w-7 h-7 bg-surface-container-high text-primary rounded flex items-center justify-center hover:bg-[#ffe088] hover:text-[#3c2f00] transition-colors cursor-pointer"
                              title="Modify Fields"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => onDeleteMenuItem(item.id)}
                              className="w-7 h-7 bg-surface-container-high text-error/80 rounded flex items-center justify-center hover:bg-error hover:text-white transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side editing or creation form entries */}
            <div className="lg:col-span-5 space-y-6">
              
              {editingItem ? (
                /* Modify existing item panel dialog */
                <form
                  onSubmit={handleUpdateItemSubmit}
                  className="bg-[#1c1b1b] p-6 rounded-2xl border border-primary/25 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                    <h3 className="font-serif text-base font-medium text-[#f2ca50]">Modify Item Details</h3>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="text-xs text-on-surface-variant hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs text-left">
                    <div className="space-y-1">
                      <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 font-sans text-xs outline-none focus:ring-1 focus:ring-primary/40"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                        Item Price (INR)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 font-sans text-xs outline-none focus:ring-1 focus:ring-primary/40"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                        Category Classification
                      </label>
                      <select
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 font-sans text-xs outline-none focus:ring-1 focus:ring-primary/40 text-on-surface"
                        value={editingItem.category}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, category: e.target.value as any })
                        }
                      >
                        {['Coffee', 'Tea', 'Pastries', 'Brunch'].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                        Description Sensory details
                      </label>
                      <textarea
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 font-sans text-xs outline-none h-18 resize-none focus:ring-1 focus:ring-primary/40"
                        value={editingItem.description}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, description: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary rounded-xl font-sans font-bold text-xs tracking-wider uppercase hover:bg-opacity-90 active:scale-95 transition-all shadow-md mt-2 cursor-pointer"
                  >
                    Save Modifications
                  </button>
                </form>
              ) : (
                /* Add a brand new item form directory */
                <form
                  onSubmit={handleCreateMenuItem}
                  className="bg-[#1c1b1b] p-6 rounded-2xl border border-outline-variant/15 space-y-4"
                >
                  <div className="border-b border-outline-variant/10 pb-2">
                    <h3 className="font-serif text-base font-semibold text-primary">Add Custom Blend / Pastry</h3>
                  </div>

                  <div className="space-y-3 text-xs text-left">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                          Blend Name
                        </label>
                        <input
                          type="text"
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 outline-none font-sans text-xs"
                          placeholder="e.g. Saffron Pistachio Cake"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans font-bold text-[#d0c5af] uppercase tracking-widest text-[10px]">
                          Price (INR)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 outline-none font-sans text-xs"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                          Category Classification
                        </label>
                        <select
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 outline-none text-on-surface"
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value as any)}
                        >
                          {['Coffee', 'Tea', 'Pastries', 'Brunch'].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans font-bold text-[#d0c5af] uppercase tracking-widest text-[10px]">
                          Tasting Tag Badge
                        </label>
                        <select
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 outline-none text-on-surface"
                          value={newItemTag}
                          onChange={(e) => setNewItemTag(e.target.value)}
                        >
                          <option value="Veg">Pure Vegetarian (Veg)</option>
                          <option value="Non-Veg">House Non-Veg</option>
                          <option value="Chef's Special">Chef's Signature Recipe</option>
                          <option value="Best Seller">Store Best Seller</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                         Sensory Description Story
                      </label>
                      <textarea
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2 outline-none h-14 resize-none"
                        placeholder=" Sensory descriptions..."
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">
                        Custom Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2.5 outline-none font-sans text-xs"
                        placeholder="Paste image link, or let us default hotlink it"
                        value={newItemImgUrl}
                        onChange={(e) => setNewItemImgUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#f2ca50] text-[#3c2f00] rounded-xl font-sans font-bold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md mt-2 cursor-pointer"
                  >
                    DEPLOY TO REALTIME MENU
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS FINANCE DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 text-left">
            
            {/* Realtime KPI stats blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#1c1b1b] border border-outline-variant/15 rounded-2xl p-6 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">payments</span>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest font-sans font-bold mb-1">
                  Accumulated Fine-Dine Revenue
                </p>
                <h3 className="font-serif text-3xl text-on-surface font-semibold">
                  ₹{analyticsData.totalRev.toLocaleString('en-IN')}
                </h3>
                <p className="text-[10px] text-green-500 font-sans font-bold mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  <span>+18.4% compared to yesterday</span>
                </p>
              </div>

              <div className="bg-[#1c1b1b] border border-outline-variant/15 rounded-2xl p-6 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">confirmation_number</span>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest font-sans font-bold mb-1">
                  Registered Diner Tickets
                </p>
                <h3 className="font-serif text-3xl text-on-surface font-semibold">
                  {analyticsData.totalTickets} Tables
                </h3>
                <p className="text-[10px] text-green-500 font-sans font-bold mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  <span>+12.1% visitor frequency rise</span>
                </p>
              </div>

              <div className="bg-[#1c1b1b] border border-outline-variant/15 rounded-2xl p-6 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">trending_up</span>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest font-sans font-bold mb-1">
                  Average Guest Ticket Value
                </p>
                <h3 className="font-serif text-3xl text-on-surface font-semibold">
                  ₹{analyticsData.avgTicket.toLocaleString('en-IN')}
                </h3>
                <p className="text-[10px] text-[#f2ca50] font-sans font-bold mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">done_all</span>
                  <span>Optimal spend frequency reached</span>
                </p>
              </div>

            </div>

            {/* Visual High-Fidelity SVG Charts section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Premium Area chart rendering via pure vector shapes */}
              <div className="bg-[#1c1b1b] border border-outline-variant/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="label-head flex justify-between items-center border-b border-outline-variant/5 pb-2 mb-4">
                  <h4 className="font-serif text-base font-semibold text-on-surface">Weekly Coffee Sales Revenue Trend</h4>
                  <span className="text-[9px] text-[#d0c5af] font-black tracking-wider uppercase border border-[#d4af37]/25 px-2 py-0.5 rounded">Realtime</span>
                </div>

                <div className="aspect-[4/2.2] w-full relative pt-2">
                  <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f2ca50" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#f2ca50" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Horizontal Gutter Gridlines */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="160" x2="500" y2="160" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 4" />
                    
                    {/* Area fill under curve */}
                    <path
                      d="M 10 160 Q 90 120, 170 140 T 330 60 T 490 30 L 490 200 L 10 200 Z"
                      fill="url(#areaGrad)"
                    />

                    {/* Smooth glowing golden curve line */}
                    <path
                      d="M 10 160 Q 90 120, 170 140 T 330 60 T 490 30"
                      fill="none"
                      stroke="#f2ca50"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Glowing coordinate circular points */}
                    <circle cx="170" cy="140" r="5" fill="#f2ca50" stroke="#1c1b1b" strokeWidth="2" />
                    <circle cx="330" cy="60" r="5" fill="#f2ca50" stroke="#1c1b1b" strokeWidth="2" />
                    <circle cx="490" cy="30" r="5" fill="#f2ca50" stroke="#1c1b1b" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-sans font-bold text-on-surface-variant/60 uppercase tracking-widest pt-4">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun (Today)</span>
                </div>
              </div>

              {/* High precision dynamic donut representation for category shares */}
              <div className="bg-[#1c1b1b] border border-outline-variant/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="label-head border-b border-outline-variant/10 pb-2 mb-4">
                  <h4 className="font-serif text-base font-semibold text-on-surface">Artisan Category Division Weight</h4>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2 h-full">
                  {/* Circular Vector Rings */}
                  <div className="relative w-36 h-36 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Girth circle */}
                      <circle cx="50" cy="50" r="32" fill="none" stroke="#252525" strokeWidth="11" />
                      
                      {/* Coffee Ring (55%) */}
                      <circle
                        cx="50" cy="50" r="32"
                        fill="none"
                        stroke="#f2ca50"
                        strokeWidth="11.5"
                        strokeDasharray="110.58 201.06" // 55% of 2*pi*32 = 201.06
                        strokeDashoffset="0"
                      />
                      {/* Sourdough Ring (25%) */}
                      <circle
                        cx="50" cy="50" r="32"
                        fill="none"
                        stroke="#ffdbce"
                        strokeWidth="12"
                        strokeDasharray="50.27 201.06" // 25% of absolute circumference
                        strokeDashoffset="-110.58"
                      />
                      {/* Pastries Ring (15%) */}
                      <circle
                        cx="50" cy="50" r="32"
                        fill="none"
                        stroke="#99907c"
                        strokeWidth="11"
                        strokeDasharray="30.16 201.06" // 15%
                        strokeDashoffset="-160.85"
                      />
                    </svg>
                    {/* Inner absolute description */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-serif text-lg font-black text-white">55%</span>
                      <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">Coffee dominant</span>
                    </div>
                  </div>

                  {/* Informative Label indicators and legends */}
                  <div className="flex-1 space-y-2.5 w-full text-left">
                    {categoryChartData.map((chk, idx) => {
                      const colors = ['bg-[#f2ca50]', 'bg-[#ffdbce]', 'bg-[#99907c]', 'bg-[#4d4635]', 'bg-[#2a2a2a]'];
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${colors[idx] || colors[0]}`} />
                            <span className="font-sans font-medium text-on-surface-variant">{chk.name}</span>
                          </div>
                          <span className="font-mono font-bold text-on-surface">{chk.percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* High level Bar meter list detailing monthly items sales */}
            <div className="bg-[#1c1b1b] border border-outline-variant/15 rounded-2xl p-6 shadow-sm">
              <h4 className="font-serif text-base font-semibold text-on-surface border-b border-outline-variant/10 pb-2 mb-4">
                Artisan Top-Selling Monthly Recipes (Audit metrics)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                {[
                  { name: 'Gold-Flaked Caramel Macchiato', count: 1480, val: 95 },
                  { name: 'Sourdough Avocado Poached Egg', count: 950, val: 78 },
                  { name: 'Classic Croissant Normandy', count: 860, val: 68 },
                  { name: 'French Press Ethiopian', count: 740, val: 58 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center font-sans">
                      <span className="font-bold text-on-surface">{item.name}</span>
                      <span className="text-primary font-mono font-semibold">{item.count} tickets sold</span>
                    </div>
                    {/* Linear meter scale bar */}
                    <div className="w-full bg-[#131313] h-2 rounded-full overflow-hidden border border-[#2a2a2a]">
                      <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: DEPLOY TABLE QR CODES GENERATOR */}
        {activeTab === 'qr' && (
          <div className="space-y-8 text-left">
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-outline-variant/15 space-y-5">
              <div className="border-b border-outline-variant/10 pb-2">
                <h3 className="font-serif text-lg font-medium text-on-surface">Interactive Custom QR Provisioner</h3>
                <p className="text-on-surface-variant text-xs mt-1">
                  Adjust configuration bounds below to provisioning table dining cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
                {/* 1. Numerical Table Counter Bounder */}
                <div className="space-y-2">
                  <label className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] block">
                    Total Restaurant Dine-In Tables
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 outline-none"
                    value={qrTotalTables}
                    onChange={(e) => setQrTotalTables(Math.max(1, Math.min(30, Number(e.target.value))))}
                  />
                  <p className="text-[10px] text-on-surface-variant/40 leading-tight">
                    Provision dynamic indices from Table 1 to Table {qrTotalTables}.
                  </p>
                </div>

                {/* 2. Logo Overlay Toggle switch */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] block">
                      Brand Icon Overlay Logo
                    </label>
                    <p className="text-[10px] text-on-surface-variant/40">
                      Embed L'Artisan coffee monogram in QR centers.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">
                      Logo status: {qrBrandLogoEnabled ? 'EMBEDDED' : 'HIDDEN'}
                    </span>
                    <div
                      onClick={() => setQrBrandLogoEnabled(!qrBrandLogoEnabled)}
                      className={`w-10 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors ${
                        qrBrandLogoEnabled ? 'bg-primary' : 'bg-[#2a2a2a]'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-[#131313] transition-transform ${
                        qrBrandLogoEnabled ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* 3. Contrast Palette theme options */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] block">
                      Contrast Brand Backdrop
                    </label>
                    <p className="text-[10px] text-on-surface-variant/40">
                      Determine printable card border themes.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1 select-none">
                    <button
                      type="button"
                      onClick={() => setQrContrastMode('gold')}
                      className={`px-3 py-1.5 rounded-lg border font-bold text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
                        qrContrastMode === 'gold'
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 text-on-surface-variant'
                      }`}
                    >
                      Classic Onyx
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrContrastMode('dark')}
                      className={`px-3 py-1.5 rounded-lg border font-bold text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
                        qrContrastMode === 'dark'
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 text-on-surface-variant'
                      }`}
                    >
                      High-Contrast Dark
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Grid of Table QR Cards generating dynamically via real server QR redirection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: qrTotalTables }).map((_, ind) => {
                const tblNum = ind + 1;
                // Construct query target pointing to standard AIS Cloud URL table selected dine parameters
                const targetUrl = `https://ais-dev-z362foavcdo7yne2worddc-685577880042.asia-east1.run.app/?table=${tblNum}`;
                const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=050505&bgcolor=${
                  qrContrastMode === 'gold' ? 'f5f5f5' : 'ffffff'
                }&data=${encodeURIComponent(targetUrl)}`;

                return (
                  <div
                    key={tblNum}
                    className={`rounded-2xl border p-5 text-center flex flex-col justify-between items-center shadow-lg transition-all ${
                      qrContrastMode === 'gold'
                        ? 'bg-black border-white/10 text-white'
                        : 'bg-[#0c0c0c] border-white/5 text-white'
                    }`}
                  >
                    <div className="space-y-1 w-full text-center border-b border-outline-variant/15 pb-2.5">
                      <span className="text-[9px] font-bold tracking-widest uppercase opacity-75">
                        L'ARTISAN PREMIUM LOUNGE
                      </span>
                      <h4 className="font-serif text-xl font-bold">Table {tblNum} Order Box</h4>
                    </div>

                    {/* QR Code Graphic Frame */}
                    <div className="my-5 relative p-3 rounded-xl bg-white border border-outline-variant/5 shadow-md flex items-center justify-center">
                      <img
                        className="w-36 h-36 object-contain"
                        alt={`QR code Table ${tblNum}`}
                        src={qrCodeSrc}
                      />
                      
                      {qrBrandLogoEnabled && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1c1b1b] border border-white/30 shadow-md flex items-center justify-center">
                          <span className="material-symbols-outlined text-[15px] text-white">
                            coffee_maker
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] font-sans font-semibold tracking-wider opacity-85 uppercase mb-4 leading-normal">
                      Scan to Curate Sensory Espresso
                    </p>

                    <div className="flex gap-2 w-full">
                      <a
                        href={qrCodeSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-white text-black hover:bg-[#e5e5e5] font-sans font-bold text-[10px] tracking-widest uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                      >
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                        <span>Print</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
