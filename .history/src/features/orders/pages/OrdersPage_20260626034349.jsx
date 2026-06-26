import React from 'react';
import OrdersHeader from '../components/OrdersHeader';
import OrdersTable from '../components/OrdersTable';
import { useOrders } from '../hooks/useOrders';

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="flex flex-col w-full gap-8 px-6 sm:px-12 lg:px-16 pb-10 min-h-full pt-4" dir="rtl">
      {/* الحاوية الرئيسية للهيدر والجدول */}
      <div className="flex flex-col w-full">
        {/* هيدر الصفحة */}
        <div className="w-full mb-3">
          <OrdersHeader />
        </div>

        {/* جدول الطلبات */}
        <div className="w-full">
          <OrdersTable orders={orders} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
