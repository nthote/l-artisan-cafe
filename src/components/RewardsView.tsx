interface RewardsViewProps {
  onBackToMenu: () => void;
}

export default function RewardsView({ onBackToMenu }: RewardsViewProps) {
  // Mock loyalty factors
  const currentPoints = 2840;
  const targetPoints = 5000;
  const percentEarned = Math.round((currentPoints / targetPoints) * 100);

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pt-24 pb-36 font-sans">
      <main className="max-w-4xl mx-auto px-6 text-left space-y-8">
        
        {/* Navigation back and header */}
        <header className="flex justify-between items-center select-none border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-white font-sans text-[10px] font-bold tracking-[0.25em] uppercase">
              Connoisseur Club
            </span>
            <h1 className="font-serif text-3xl font-medium text-on-surface">Posh Rewards Lounge</h1>
          </div>
          
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 text-on-surface-variant hover:text-white font-bold text-xs tracking-wider uppercase bg-[#0c0c0c] px-4.5 py-2.5 rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Cafe</span>
          </button>
        </header>

        {/* Rank progression banner panel */}
        <section className="bg-[#0c0c0c] rounded-2xl border border-white/10 p-6 relative overflow-hidden shadow-lg">
          {/* Ambient graphic glow circles */}
          <div className="absolute -right-24 -top-24 w-52 h-52 aroma-glow-strong pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 border border-white/20 rounded-xl bg-surface flex items-center justify-center text-white font-black shadow-md">
                  B
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-on-surface">Bronze Artisan Status</h2>
                  <p className="text-[10px] text-white font-sans font-bold tracking-widest uppercase">
                    Level 2 Connoisseur
                  </p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed">
                You are currently earning double points on all pour-overs. Track your sensory transactions to reach Silver Connoisseur level and unlock private cupping invitations!
              </p>
            </div>

            {/* Loyalty points tracker dials */}
            <div className="bg-[#050505] p-4.5 rounded-xl border border-white/5 min-w-[200px] text-right font-sans shrink-0">
              <p className="text-[9px] uppercase font-bold tracking-widest text-[#909090] mb-1">
                Accumulated Balance
              </p>
              <h3 className="font-serif text-3xl font-light italic text-white leading-none">
                2,840 <span className="text-xs font-sans text-on-surface font-light">pts</span>
              </h3>
              <p className="text-[10px] text-on-surface-variant mt-2.5">
                {targetPoints - currentPoints} pts remaining to level up
              </p>
            </div>
          </div>

          {/* Stepper bar progress */}
          <div className="pt-6 space-y-2">
            <div className="w-full bg-[#050505] h-2.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-primary shimmer-progress transition-all duration-1000"
                style={{ width: `${percentEarned}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-sans font-bold text-on-surface-variant/65 uppercase tracking-widest">
              <span>Bronze Artisan (0 pts)</span>
              <span>{percentEarned}% Progress</span>
              <span>Silver Connoisseur (5,000 pts)</span>
            </div>
          </div>
        </section>

        {/* Bento privileges Perks Grid */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-on-surface font-medium border-b border-outline-variant/5 pb-2.5 select-none">
            Your Premium Connoisseur Perks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <span className="material-symbols-outlined text-white text-3xl">savings</span>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#e5e2e1]">10% Roast Cashback</h4>
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">
                  Get 10% cash value credited back on all French Press and cold drippers.
                </p>
              </div>
              <span className="text-[9px] font-semibold uppercase text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-md min-w-[70px] text-center shrink-0">
                ACTIVE PRIVILEGE
              </span>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between opacity-90">
              <span className="material-symbols-outlined text-white text-3xl">cake</span>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#e5e2e1]">Birthday Roast Pack</h4>
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">
                  Complimentary 250g dark roast parchment bag gifted during your birthday month.
                </p>
              </div>
              <span className="text-[9px] font-semibold uppercase text-on-surface-variant bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-center max-w-[85px]">
                ONCE ANNUALLY
              </span>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between opacity-80">
              <span className="material-symbols-outlined text-white text-3xl">group</span>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#e5e2e1]">Priority Seating Pass</h4>
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">
                  Skip the long roastery foyer queues during weekend brunches and masterclasses.
                </p>
              </div>
              <span className="text-[9px] font-semibold uppercase text-on-surface-variant bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-center max-w-[124px]">
                REACH SILVER (5K PTS)
              </span>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between opacity-80">
              <span className="material-symbols-outlined text-white text-3xl">emoji_events</span>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#e5e2e1]">Private Tasting Invites</h4>
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">
                  Entry tickets to hand-poured sensory tutorials and direct trade coffee launch sessions.
                </p>
              </div>
              <span className="text-[9px] font-semibold uppercase text-on-surface-variant bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-center max-w-[124px]">
                REACH GOLD (10K PTS)
              </span>
            </div>

          </div>
        </section>

        {/* Editorial Atelier Roastery image */}
        <section className="bg-[#0c0c0c] rounded-2xl border border-white/5 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden select-none">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
            <img
              className="w-full h-full object-cover"
              alt="Artisan Roastery"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCheS7dGWVZbavg5PZWOhevv3CIdKtaESx6VpGOAgmDnQpvkQS2WKdE6D5HY4fF8Qt6rqDGeJXOvL5iqsa9a_owdUxG-GwwA82nzDQlh-7sUU5z9tQqRAsNYWEkYXLUl5C4klWhQUGGWUk5PbD9aOteoeYEsz8ICozMq5q9N0rJXWzdTfF_70GO-zvibiPdMird_69gzQTn5nDmKXPumQMmbrr72r9fs9LQXjdB2g6JvUtuQrm78DAlFO962sxa6Ji6yL9cn4U_EyU"
            />
          </div>

          <div className="flex-1 space-y-2.5 text-left">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
                Atelier Roastery Tour
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-on-surface">The Sensory Hearth</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Every crop undergoes rigid sample tests inside our glass Atelier hub before selection for roast profiles. Connoisseurs are always welcome to join our Saturday cuppings for sensory deep-dives.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
