import { Search, ChevronRight, ChevronLeft } from 'lucide-react';

const DoctorCard = ({ name, status, image }) => (
  <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    {/* نمط خلفية بسيط */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
    
    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative z-10">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    
    <div className="text-center relative z-10">
      <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{status}</p>
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
    <div className="p-8 flex flex-col h-full bg-gray-50/50">
      {/* البار العلوي في الصفحة */}
      <div className="flex justify-between items-center mb-10 gap-6">
        {/* حقل البحث */}
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="بحث.." 
            className="w-full bg-white border-none py-3 pr-12 pl-6 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 text-gray-600 font-medium"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* عنوان الصفحة */}
        <div className="bg-gray-200/50 px-10 py-3 rounded-2xl font-black text-gray-700 text-lg">
          الاطباء
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow">
        {doctors.map((doc, index) => (
          <DoctorCard key={index} {...doc} />
        ))}
      </div>

      {/* الترقيم (Pagination) */}
      <div className="mt-10 flex justify-center items-center gap-2">
        <button className="p-2 rounded-xl bg-white shadow-sm text-gray-400 hover:text-primary transition-colors">
          <ChevronRight size={24} />
        </button>
        
        {[1, 2, 3, 4, 5].map((num) => (
          <button 
            key={num} 
            className={`w-10 h-10 rounded-xl font-bold transition-all ${
              num === 1 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "bg-white text-gray-400 hover:bg-gray-50"
            }`}
          >
            {num}
          </button>
        ))}
        
        <span className="text-gray-300 mx-1">...</span>
        
        <button className="p-2 rounded-xl bg-white shadow-sm text-gray-400 hover:text-primary transition-colors">
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default DoctorsPage;
