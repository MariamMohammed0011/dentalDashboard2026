import React from 'react';

const AdsPage = () => {
  const ads = Array(16).fill({
    source: "د. احمد غانم",
    duration: "7 ايام",
    status: "دفع كامل المبلغ",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=200&h=200"
  });

  return (
    <div className="p-2">
      
      <div className="flex items-center justify-between mb-8 bg-transparent p-2 rounded-2xl">
        <div className="flex gap-2">
          <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
            إضافة اعلان
          </button>
          <button className="bg-red-500/10 text-red-500 px-8 py-2.5 rounded-xl font-bold border border-red-500/20 transition-transform active:scale-95">
            إيقاف اعلان
          </button>
        </div>
        <div className="bg-bg-card px-8 py-2.5 rounded-xl shadow-sm border border-border-main">
          <h1 className="text-xl font-black text-text-main">الإعلانات</h1>
        </div>
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {ads.map((ad, index) => (
          <div key={index} className="bg-bg-card border border-border-main rounded-[2rem] overflow-hidden flex items-stretch shadow-sm hover:shadow-md transition-shadow">
            
            <button className="bg-primary text-white flex flex-col justify-center px-4 hover:bg-primary/90 transition-colors group">
              <span className="[writing-mode:vertical-rl] rotate-180 text-sm font-black tracking-widest group-hover:scale-110 transition-transform">عرض</span>
            </button>

            
            <div className="flex-grow p-5 flex justify-between items-center gap-4">
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-1 justify-end">
                   <span className="font-medium text-text-muted text-sm">{ad.source}</span>
                   <p className="text-sm font-black text-text-main">:المصدر</p>
                </div>
                <div className="flex items-center gap-1 justify-end">
                   <span className="font-medium text-text-muted text-sm">{ad.duration}</span>
                   <p className="text-sm font-black text-text-main">:مدة الإعلان</p>
                </div>
                <div className="flex items-center gap-1 justify-end">
                   <span className="font-medium text-text-muted text-sm">{ad.status}</span>
                   <p className="text-sm font-black text-text-main">:حالة الدفع</p>
                </div>
              </div>
              
              {/* Ad Image */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-bg-main">
                <img src={ad.image} alt="Ad" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-12 mb-6 gap-3 items-center">
         <button className="w-10 h-10 rounded-xl border border-border-main flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors bg-bg-card shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </button>
         
         <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black">1</button>
            <button className="w-10 h-10 rounded-xl text-text-muted hover:bg-primary/5 flex items-center justify-center font-bold bg-bg-card border border-border-main">2</button>
            <button className="w-10 h-10 rounded-xl text-text-muted hover:bg-primary/5 flex items-center justify-center font-bold bg-bg-card border border-border-main">3</button>
            <button className="w-10 h-10 rounded-xl text-text-muted hover:bg-primary/5 flex items-center justify-center font-bold bg-bg-card border border-border-main">4</button>
            <button className="w-10 h-10 rounded-xl text-text-muted hover:bg-primary/5 flex items-center justify-center font-bold bg-bg-card border border-border-main">5</button>
            <button className="w-10 h-10 rounded-xl text-text-muted flex items-center justify-center font-bold">...</button>
         </div>

         <button className="w-10 h-10 rounded-xl border border-border-main flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors rotate-180 bg-bg-card shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </button>
      </div>
    </div>
  );
};

export default AdsPage;

