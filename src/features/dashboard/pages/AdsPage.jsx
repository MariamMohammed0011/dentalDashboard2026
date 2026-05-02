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
      {/* Header Tabs/Buttons */}
      <div className="flex items-center justify-between mb-8 bg-gray-50/50 p-2 rounded-2xl">
        <div className="flex gap-2">
          <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
            إضافة اعلان
          </button>
          <button className="bg-[#FFD1D1] text-[#FF4B4B] px-8 py-2.5 rounded-xl font-bold border border-red-100 transition-transform active:scale-95">
            إيقاف اعلان
          </button>
        </div>
        <div className="bg-white px-8 py-2.5 rounded-xl shadow-sm">
          <h1 className="text-xl font-black text-gray-800">الإعلانات</h1>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {ads.map((ad, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex items-stretch shadow-sm hover:shadow-md transition-shadow">
            {/* View Button (Side) */}
            <button className="bg-primary text-white flex flex-col justify-center px-4 hover:bg-primary/90 transition-colors group">
              <span className="[writing-mode:vertical-rl] rotate-180 text-sm font-black tracking-widest group-hover:scale-110 transition-transform">عرض</span>
            </button>

            {/* Ad Content */}
            <div className="flex-grow p-5 flex justify-between items-center gap-4">
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-1 justify-end">
                   <span className="font-medium text-gray-500 text-sm">{ad.source}</span>
                   <p className="text-sm font-black text-gray-800">:المصدر</p>
                </div>
                <div className="flex items-center gap-1 justify-end">
                   <span className="font-medium text-gray-500 text-sm">{ad.duration}</span>
                   <p className="text-sm font-black text-gray-800">:مدة الإعلان</p>
                </div>
                <div className="flex items-center gap-1 justify-end">
                   <span className="font-medium text-gray-500 text-sm">{ad.status}</span>
                   <p className="text-sm font-black text-gray-800">:حالة الدفع</p>
                </div>
              </div>
              
              {/* Ad Image */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-gray-100">
                <img src={ad.image} alt="Ad" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-12 mb-6 gap-3 items-center">
         <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </button>
         
         <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-blue-50 text-primary border border-primary/30 flex items-center justify-center font-black">1</button>
            <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-50 flex items-center justify-center font-bold">2</button>
            <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-50 flex items-center justify-center font-bold">3</button>
            <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-50 flex items-center justify-center font-bold">4</button>
            <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-50 flex items-center justify-center font-bold">5</button>
            <button className="w-10 h-10 rounded-xl text-gray-400 flex items-center justify-center font-bold">...</button>
         </div>

         <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors rotate-180">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </button>
      </div>
    </div>
  );
};

export default AdsPage;

