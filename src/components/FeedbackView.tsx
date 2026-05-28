import { useState } from 'react';
import { Order, FeedbackRating } from '../types';

interface FeedbackViewProps {
  order: Order | null;
  onSubmit: (feedback: FeedbackRating) => void;
  onBackToMenu: () => void;
}

export default function FeedbackView({ order, onSubmit, onBackToMenu }: FeedbackViewProps) {
  const [overallStars, setOverallStars] = useState(5);
  const [culinaryStars, setCulinaryStars] = useState(5);
  const [serviceStars, setServiceStars] = useState(5);
  const [comments, setComments] = useState('');
  const [thumbs, setThumbs] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Set thumb feedback of individual menu items bought
  const handleThumb = (itemId: string, direction: 'up' | 'down') => {
    setThumbs((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === direction ? null : direction,
    }));
  };

  const handleSendFeedback = () => {
    onSubmit({
      overall: overallStars,
      culinary: culinaryStars,
      service: serviceStars,
      comments,
      itemThumbs: thumbs,
      submitted: true,
    });
    setIsSubmitted(true);
  };

  const renderStars = (
    current: number,
    setVal: (val: number) => void,
    label: string
  ) => {
    return (
      <div className="space-y-1.5 text-left">
        <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#d0c5af]/80">
          {label}
        </label>
        <div className="flex gap-2.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setVal(star)}
              className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-0.5"
            >
              <span
                className={`material-symbols-outlined text-3xl transition-transform duration-200 active:scale-90 select-none cursor-pointer ${
                  star <= current ? 'text-white fill-current' : 'text-on-surface-variant/20'
                }`}
                style={{ fontVariationSettings: star <= current ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        {/* Gentle Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-md mx-auto space-y-6 relative z-10 p-6 flex flex-col items-center">
          <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center bg-[#1c1b1b]/45 backdrop-blur-md">
            <span className="material-symbols-outlined text-white text-[48px] animate-pulse">
              sentiment_very_satisfied
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-white font-medium tracking-wide italic">
              Merci Beaucoup!
            </h1>
            <p className="font-sans text-xs text-[#d0c5af] tracking-[0.22em] uppercase font-bold">
              Feedback Curated with Care
            </p>
          </div>

          <div className="h-[1px] w-12 bg-white/15" />

          <p className="text-on-surface-variant text-sm leading-relaxed">
            Your generous feedback shapes our sensory recipes. Our master roasters and baristas are grateful for your reflections.
          </p>

          <button
            onClick={onBackToMenu}
            className="px-8 py-3.5 bg-white text-black font-sans font-medium text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-[#e5e5e5] active:scale-95 transition-all shadow-[0_4px_25px_rgba(255,255,255,0.05)] border border-white/10 cursor-pointer"
          >
            RETURN TO SENSORY STOREFRONT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pt-24 pb-36 font-sans">
      <div className="max-w-2xl mx-auto px-6 space-y-8 text-left">
        {/* Headings */}
        <header className="space-y-2 border-b border-outline-variant/15 pb-4 select-none">
          <span className="text-primary font-sans text-[11px] font-bold tracking-[0.25em] uppercase">
            A Moment of Reflection
          </span>
          <h1 className="font-serif text-3xl text-on-surface">
            Shape Our Craft
          </h1>
          <p className="text-on-surface-variant text-xs">
            Reflecting on your sensory experience helps us preserve premium culinary standards.
          </p>
        </header>

        {/* Triple Rating Stars block */}
        <section className="bg-surface-container rounded-2xl border border-outline-variant/15 p-6 space-y-6 shadow-sm">
          <h2 className="font-serif text-base text-on-surface font-medium border-b border-outline-variant/5 pb-2">
            Experience Matrices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderStars(overallStars, setOverallStars, 'Overall Satisfaction')}
            {renderStars(culinaryStars, setCulinaryStars, 'Culinary Craftsmanship')}
            {renderStars(serviceStars, setServiceStars, 'Hospitality Service')}
          </div>
        </section>

        {/* Item Specific Thumb selection feedback */}
        {order && order.items.length > 0 && (
          <section className="bg-surface-container rounded-2xl border border-outline-variant/15 p-6 space-y-4 shadow-sm">
            <h2 className="font-serif text-base text-on-surface font-medium border-b border-outline-variant/5 pb-2">
              Rate Your Curated Blends
            </h2>

            <div className="divide-y divide-outline-variant/10">
              {order.items.map((item) => {
                const itemId = item.menuItem.id;
                const activeThumb = thumbs[itemId] || null;

                return (
                  <div key={item.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant/20 shrink-0">
                        <img className="w-full h-full object-cover" src={item.menuItem.imageUrl} alt={item.menuItem.name} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{item.menuItem.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60">Table {order.tableNumber}</p>
                      </div>
                    </div>

                    {/* Thumbs up and down toggle */}
                    <div className="flex gap-2 select-none">
                      <button
                        onClick={() => handleThumb(itemId, 'up')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          activeThumb === 'up'
                            ? 'bg-primary/20 text-primary border border-primary/45'
                            : 'bg-surface-container-low border border-outline-variant/15 text-on-surface-variant/60 hover:text-white'
                        }`}
                        title="Tastes Majestic"
                      >
                        <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                      </button>

                      <button
                        onClick={() => handleThumb(itemId, 'down')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          activeThumb === 'down'
                            ? 'bg-error/25 text-error border border-error/45'
                            : 'bg-surface-container-low border border-outline-variant/15 text-on-surface-variant/60 hover:text-white'
                        }`}
                        title="Room for refinement"
                      >
                        <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Written textarea review comments */}
        <section className="space-y-2">
          <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#d0c5af]">
            Custom Observations &amp; Advice
          </label>
          <textarea
            className="w-full bg-surface-container border border-outline-variant/25 rounded-xl p-4 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:ring-1 focus:ring-primary/45 h-28 resize-none"
            placeholder="Draft any custom observations, culinary queries, or notes for the Barista Master..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </section>

        {/* Submit feedback CTA button */}
        <button
          onClick={handleSendFeedback}
          className="w-full bg-white text-black hover:bg-[#e5e5e5] py-4 rounded-xl font-sans font-medium text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_25px_rgba(255,255,255,0.05)] border border-white/10 cursor-pointer"
        >
          <span>SUBMIT LOUNGE STUDY</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
}
