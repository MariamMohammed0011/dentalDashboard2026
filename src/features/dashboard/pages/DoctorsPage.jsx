import { Search, ChevronRight, ChevronLeft } from 'lucide-react';

const DoctorCard = ({ name, status, image }) => (
  <div className="bg-bg-card rounded-3xl p-6 flex flex-col items-center gap-4 border border-border-main shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    {/* نمط خلفية بسيط */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
    
    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-bg-card shadow-md relative z-10">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    
    <div className="text-center relative z-10">
      <h3 className="font-bold text-text-main text-lg">{name}</h3>
      <p className="text-text-muted text-sm mt-1">{status}</p>
    </div>
  </div>
);

const DoctorsPage = () => {
  const doctors = Array(12).fill({
    name: "د. احمد حسين",
    status: "حالة الحساب: مفعل",
    image: "https://i.pravatar.cc/150?u=1"
  });

  return (
    <div className="p-8 flex flex-col h-full bg-transparent">
      {/* البار العلوي في الصفحة */}
      <div className="flex justify-between items-center mb-10 gap-6">
        {/* حقل البحث */}
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="بحث.." 
            className="w-full bg-bg-card border-none py-3 pr-12 pl-6 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 text-text-main font-medium placeholder-text-muted/50"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        </div>

        {/* عنوان الصفحة */}
        <div className="bg-bg-card px-10 py-3 rounded-2xl font-black text-text-main text-lg border border-border-main">
          الاطباء
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow">
        {doctors.map((doc, index) => (
          <DoctorCard key={index} {...doc} />
        ))}
      </div>

      <div className="mt-10 flex justify-center items-center gap-2">
        <button className="p-2 rounded-xl bg-bg-card shadow-sm text-text-muted hover:text-primary transition-colors border border-border-main">
          <ChevronRight size={24} />
        </button>
        
        {[1, 2, 3, 4, 5].map((num) => (
          <button 
            key={num} 
            className={`w-10 h-10 rounded-xl font-bold transition-all border ${
              num === 1 
                ? "bg-primary text-white shadow-lg shadow-primary/30 border-primary" 
                : "bg-bg-card text-text-muted hover:bg-primary/5 border-border-main"
            }`}
          >
            {num}
          </button>
        ))}
        
        <span className="text-text-muted/30 mx-1">...</span>
        
        <button className="p-2 rounded-xl bg-bg-card shadow-sm text-text-muted hover:text-primary transition-colors border border-border-main">
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default DoctorsPage;
