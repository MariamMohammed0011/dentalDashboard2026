import React from 'react';
import { motion } from 'framer-motion';

const DoctorCard = ({ name, status, image }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-white rounded-[2rem] p-6 flex flex-col items-center gap-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(54,122,255,0.08)] transition-all duration-300 group relative overflow-hidden h-[280px]" 
      dir="rtl"
    >
      {/* نمط زخرفي في الخلفية */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle,rgba(54,122,255,0.4)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
      </div>
      
      {/* الصورة الشخصية */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10 mt-2">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      
      {/* المعلومات */}
      <div className="text-center relative z-10 flex flex-col gap-1 mt-2">
        <h3 className="font-bold text-text-main text-lg">{name}</h3>
        <p className="text-gray-400 text-sm font-medium">{status}</p>
      </div>

      {/* لمسة تجميلية سفلية */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300" />
    </motion.div>
  );
};

export default DoctorCard;
