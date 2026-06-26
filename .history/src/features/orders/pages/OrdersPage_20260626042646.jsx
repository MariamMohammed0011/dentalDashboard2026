import React, { useState } from 'react';
import OrdersHeader from '../components/OrdersHeader';
import OrdersTable from '../components/OrdersTable';
import { useOrders } from '../hooks/useOrders';

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  // دالة الفلترة والبحث الذكي
  const filteredOrders = orders?.filter((order) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true; // إذا كان حقل البحث فارغاً، اعرض كل الطلبات

    const matchesId = order.id?.toString().includes(term);
    const matchesDoctor = order.doctor?.toLowerCase().includes(term);
    const matchesLab = order.lab?.toLowerCase().includes(term);

    return matchesId || matchesDoctor || matchesLab;
  });
  // 2. ترتيب البيانات المفلترة بناءً على خيار المستخدم (تصاعدي أو تنازلي)
  const sortedAndFilteredOrders = filteredOrders?.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.id - b.id; // من الأصغر للأكبر
    } else {
      return b.id - a.id; // من الأكبر للأصغر
    }
  });
  return (
    <div className="flex flex-col w-full gap-8 px-6 sm:px-12 lg:px-16 pb-10 min-h-full " dir="rtl" >
      {/* الحاوية الرئيسية للهيدر والجدول */}
      <div className="flex flex-col w-full">
        {/* هيدر الصفحة */}
        <div className="w-full mb-4">
          <OrdersHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* جدول الطلبات */}
        <div className="w-full">
          <OrdersTable orders={filteredOrders} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
