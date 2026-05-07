import React from 'react';
import OrdersHeader from '../components/OrdersHeader';
import OrdersTable from '../components/OrdersTable';
import { useOrders } from '../hooks/useOrders';

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="p-4 md:p-8 flex flex-col h-full bg-transparent mt-8">
      {/* هيدر الصفحة */}
      <OrdersHeader />

      {/* جدول الطلبات */}
      <OrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
};

export default OrdersPage;
